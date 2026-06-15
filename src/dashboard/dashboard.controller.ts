import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { AppError, ErrorCode } from '../common/errors';

function userId(req: Request): string {
  const id = (req as Request & { user?: { id?: string } }).user?.id;
  if (!id) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  return id;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}

  // 학생 대시보드 집계 — 데이터가 없으면 0/빈 배열 (실배포 기준: 신규 계정은 처음부터 0).
  @Get('dashboard/student')
  async student(@Req() req: Request) {
    const uid = userId(req);
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [grades, activeSession, targetCount, upcomingCount] = await Promise.all([
      this.prisma.grade.findMany({ where: { userId: uid }, orderBy: { term: 'asc' } }),
      this.prisma.counselingSession.findFirst({ where: { userId: uid, status: 'active' } }),
      this.prisma.careerTarget.count({ where: { userId: uid } }),
      this.prisma.calendarEvent.count({ where: { userId: uid, startsAt: { gte: now, lte: weekLater } } }),
    ]);

    // 성적 평균 + 학기별 추이 (점수 있는 항목만)
    const scored = grades.filter((g) => g.score != null);
    const byTerm = new Map<string, number[]>();
    for (const g of scored) {
      const arr = byTerm.get(g.term) ?? [];
      arr.push(g.score as number);
      byTerm.set(g.term, arr);
    }
    const gradeTrend = [...byTerm.entries()].map(([term, scores]) => ({
      term,
      average: round1(scores.reduce((a, b) => a + b, 0) / scores.length),
    }));
    // 최근 학기 평균 (없으면 null — 프론트가 "기록 없음"으로 표시)
    const gradeAverage = gradeTrend.length ? gradeTrend[gradeTrend.length - 1].average : null;

    // AI 상담 진행도 — counseling.service.progressOf와 동일 공식 (signals*12 + min(turns,8)*4)
    let aiProgress = 0;
    let aiStage: string | null = null;
    let signalsCount = 0;
    if (activeSession) {
      const [signals, userTurns] = await Promise.all([
        this.prisma.counselingSignal.count({ where: { sessionId: activeSession.id } }),
        this.prisma.counselingMessage.count({ where: { sessionId: activeSession.id, role: 'user' } }),
      ]);
      signalsCount = signals;
      aiProgress = Math.min(100, signals * 12 + Math.min(userTurns, 8) * 4);
      aiStage = signals < 3 ? 'explore' : signals < 6 ? 'profile' : 'recommend';
    }

    return {
      data: {
        gradeAverage, // number | null
        gradeTrend, // [{ term, average }]
        hasGrades: scored.length > 0,
        aiProgress, // 0~100
        aiStage, // explore|profile|recommend|prepare|null
        signalsCount,
        targetCount, // 관심 진로/학과 수
        upcomingCount, // 향후 7일 일정 수
      },
    };
  }
}
