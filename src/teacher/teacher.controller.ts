import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { randomInt } from 'node:crypto';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { AppError, ErrorCode } from '../common/errors';

// 혼동되는 문자(0/O, 1/I) 제외한 영숫자 — 6자 초대코드 생성용.
const INVITE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function genInviteCode(len = 6): string {
  let out = '';
  for (let i = 0; i < len; i++) out += INVITE_ALPHABET[randomInt(INVITE_ALPHABET.length)];
  return out;
}

function requireTeacher(req: Request): AuthUser {
  const user = (req as Request & { user?: AuthUser }).user;
  if (!user) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  if (user.role !== 'teacher' && user.role !== 'admin') throw new AppError(ErrorCode.AUTH_FORBIDDEN, '교사 전용 기능이에요.');
  return user;
}

function isoWeekKey(d: Date): string {
  const dt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = dt.getUTCDay() || 7;
  dt.setUTCDate(dt.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((dt.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return dt.getUTCFullYear() + '-W' + String(weekNo).padStart(2, '0');
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

@Controller('v1/teacher')
@UseGuards(JwtAuthGuard)
export class TeacherController {
  constructor(private readonly prisma: PrismaService) {}

  // 교사 학급 초대코드 — 없으면 충돌 안 나는 유니크 6자 코드를 생성해 저장 후 반환.
  // 학생은 회원가입 시 이 코드를 입력해 학급에 자동 참여(auth.service).
  @Get('invite-code')
  async inviteCode(@Req() req: Request) {
    const me = requireTeacher(req);
    const teacher = await this.prisma.user.findUnique({ where: { id: me.id } });
    if (teacher?.inviteCode) {
      return { data: { inviteCode: teacher.inviteCode } };
    }
    // 유니크 코드 생성 — 충돌 시 재시도(유니크 제약 충돌 P2002).
    for (let attempt = 0; attempt < 8; attempt++) {
      const code = genInviteCode();
      try {
        const updated = await this.prisma.user.update({ where: { id: me.id }, data: { inviteCode: code } });
        return { data: { inviteCode: updated.inviteCode } };
      } catch (e) {
        const code2 = (e as { code?: string })?.code;
        // 동시 생성으로 내 코드가 이미 채워졌다면 그걸 반환.
        const fresh = await this.prisma.user.findUnique({ where: { id: me.id } });
        if (fresh?.inviteCode) return { data: { inviteCode: fresh.inviteCode } };
        if (code2 !== 'P2002') throw e; // 코드 중복 외 에러는 전파
        // P2002 → 코드 충돌, 다음 시도
      }
    }
    throw new AppError(ErrorCode.INTERNAL, '초대코드를 생성하지 못했어요. 잠시 후 다시 시도해주세요.');
  }

  // 초대코드 재발급 — 기존 코드를 새 유니크 코드로 교체. 이미 가입한 학생은 영향 없음.
  @Post('invite-code/regenerate')
  async regenerateInviteCode(@Req() req: Request) {
    const me = requireTeacher(req);
    for (let attempt = 0; attempt < 8; attempt++) {
      const code = genInviteCode();
      try {
        const updated = await this.prisma.user.update({ where: { id: me.id }, data: { inviteCode: code } });
        return { data: { inviteCode: updated.inviteCode } };
      } catch (e) {
        if ((e as { code?: string })?.code !== 'P2002') throw e; // 코드 충돌만 재시도
      }
    }
    throw new AppError(ErrorCode.INTERNAL, '초대코드를 재발급하지 못했어요. 잠시 후 다시 시도해주세요.');
  }

  // 내 학급 학생 — 같은 학교+반. 각 학생의 핵심 지표 집계.
  @Get('students')
  async students(@Req() req: Request) {
    const me = requireTeacher(req);
    const teacher = await this.prisma.user.findUnique({ where: { id: me.id } });
    // 스코핑: 학급 미배정 교사(school/classroom 없음)는 전체 학생 무차별 노출을 막기 위해 빈 목록.
    // (messages.controller와 동일 정책 — 미성년자 데이터 과다 노출 방지) admin만 예외.
    if (me.role === 'teacher' && (!teacher?.school || !teacher?.classroom)) {
      return { data: [], meta: { classroom: teacher?.classroom ?? null, school: teacher?.school ?? null, count: 0 } };
    }
    const students = await this.prisma.user.findMany({
      where: {
        role: 'student',
        status: 'active',
        ...(teacher?.school ? { school: teacher.school } : {}),
        ...(teacher?.classroom ? { classroom: teacher.classroom } : {}),
      },
      orderBy: { name: 'asc' },
      take: 200,
    });

    const weekKey = isoWeekKey(new Date());
    const rows = await Promise.all(
      students.map(async (s) => {
        const [grades, session, weekTasks, targetCount] = await Promise.all([
          this.prisma.grade.findMany({ where: { userId: s.id }, orderBy: { term: 'asc' } }),
          this.prisma.counselingSession.findFirst({ where: { userId: s.id, status: 'active' } }),
          this.prisma.studyTask.findMany({ where: { userId: s.id, weekKey } }),
          this.prisma.careerTarget.count({ where: { userId: s.id } }),
        ]);
        // 최근 학기 평균
        const byTerm = new Map<string, number[]>();
        grades.filter((g) => g.score != null).forEach((g) => {
          const a = byTerm.get(g.term) ?? [];
          a.push(g.score as number);
          byTerm.set(g.term, a);
        });
        const terms = [...byTerm.keys()].sort();
        const last = terms.length ? byTerm.get(terms[terms.length - 1])! : null;
        const gradeAverage = last ? round1(last.reduce((a, b) => a + b, 0) / last.length) : null;

        let aiProgress = 0;
        let signalsCount = 0;
        if (session) {
          const [signals, userTurns] = await Promise.all([
            this.prisma.counselingSignal.count({ where: { sessionId: session.id } }),
            this.prisma.counselingMessage.count({ where: { sessionId: session.id, role: 'user' } }),
          ]);
          signalsCount = signals;
          aiProgress = Math.min(100, signals * 12 + Math.min(userTurns, 8) * 4);
        }
        const studyTotal = weekTasks.length;
        const studyDone = weekTasks.filter((t) => t.done).length;
        // 마지막 활동 시각
        const lastActivity = [
          session?.startedAt,
          ...grades.map((g) => g.updatedAt),
          ...weekTasks.map((t) => t.updatedAt),
        ].filter(Boolean).map((d) => new Date(d as Date).getTime());
        const lastActivityAt = lastActivity.length ? new Date(Math.max(...lastActivity)).toISOString() : null;
        // 상담 필요 휴리스틱: 진행도 낮고 단서 적음
        const needsCounseling = aiProgress < 24 && signalsCount < 2;

        return {
          id: s.id,
          name: s.name,
          grade: s.grade,
          gradeAverage,
          aiProgress,
          signalsCount,
          targetCount,
          studyDone,
          studyTotal,
          lastActivityAt,
          needsCounseling,
        };
      }),
    );

    return {
      data: rows,
      meta: { classroom: teacher?.classroom ?? null, school: teacher?.school ?? null, count: rows.length },
    };
  }

  // 학급 성적 추이 — 학급 학생들의 학기별 평균 (실 성적 집계).
  @Get('grade-trend')
  async gradeTrend(@Req() req: Request) {
    const me = requireTeacher(req);
    const teacher = await this.prisma.user.findUnique({ where: { id: me.id } });
    // 스코핑: 학급 미배정 교사는 전체 학생 성적 집계 노출 차단 (students와 동일 정책). admin만 예외.
    if (me.role === 'teacher' && (!teacher?.school || !teacher?.classroom)) {
      return { data: [], meta: { studentCount: 0, gradeCount: 0 } };
    }
    const students = await this.prisma.user.findMany({
      where: {
        role: 'student', status: 'active',
        ...(teacher?.school ? { school: teacher.school } : {}),
        ...(teacher?.classroom ? { classroom: teacher.classroom } : {}),
      },
      select: { id: true },
    });
    const ids = students.map((s) => s.id);
    const grades = ids.length
      ? await this.prisma.grade.findMany({ where: { userId: { in: ids }, score: { not: null } }, select: { term: true, score: true } })
      : [];
    const byTerm = new Map<string, number[]>();
    for (const g of grades) {
      const a = byTerm.get(g.term) ?? [];
      a.push(g.score as number);
      byTerm.set(g.term, a);
    }
    const trend = [...byTerm.entries()]
      .map(([term, scores]) => ({ term, average: round1(scores.reduce((a, b) => a + b, 0) / scores.length), count: scores.length }))
      .sort((a, b) => a.term.localeCompare(b.term));
    return { data: trend, meta: { studentCount: students.length, gradeCount: grades.length } };
  }

  // 학생 상세 — 내 학급 학생만 조회 가능.
  @Get('students/:id')
  async studentDetail(@Req() req: Request, @Param('id') id: string) {
    const me = requireTeacher(req);
    const teacher = await this.prisma.user.findUnique({ where: { id: me.id } });
    const student = await this.prisma.user.findUnique({ where: { id } });
    if (!student || student.role !== 'student') throw new AppError(ErrorCode.NOT_FOUND, '학생을 찾을 수 없어요.');
    // admin은 전체, teacher는 같은 학급만.
    // 학급 미배정 교사(school/classroom null)는 null===null 매칭으로 미배정 학생을 보는 것을 막기 위해
    // 먼저 본인 학급 정보 보유를 요구한다.
    if (me.role === 'teacher') {
      if (!teacher?.school || !teacher?.classroom) {
        throw new AppError(ErrorCode.AUTH_FORBIDDEN, '담당 학급 학생만 조회할 수 있어요.');
      }
      if (student.school !== teacher.school || student.classroom !== teacher.classroom) {
        throw new AppError(ErrorCode.AUTH_FORBIDDEN, '담당 학급 학생만 조회할 수 있어요.');
      }
    }

    const [grades, session, targets] = await Promise.all([
      this.prisma.grade.findMany({ where: { userId: id }, orderBy: [{ term: 'asc' }, { subject: 'asc' }] }),
      this.prisma.counselingSession.findFirst({ where: { userId: id, status: 'active' } }),
      this.prisma.careerTarget.findMany({ where: { userId: id }, orderBy: { createdAt: 'asc' } }),
    ]);

    // 감사 로그 — 교사가 학생 상세를 조회한 사실 기록 (학생 PII 보호 책무).
    // 학생 본인은 자기 데이터를 보는 것이라 기록 안 함(actor!=student). best-effort, 실패해도 응답 안 막음.
    try {
      if (me.role === 'teacher' || me.role === 'admin') {
        await this.prisma.auditLog.create({
          data: {
            actorId: me.id,
            action: 'student.view',
            summary: `${me.role === 'teacher' ? '교사' : '관리자'} ${(teacher && teacher.name) || ''}가 학생 ${student.name} 상세 조회`,
            reason: null,
          },
        });
      }
    } catch (e) { /* silent */ }
    let signals: { tag: string; text: string }[] = [];
    let aiProgress = 0;
    if (session) {
      const sgs = await this.prisma.counselingSignal.findMany({ where: { sessionId: session.id }, orderBy: { createdAt: 'asc' } });
      signals = sgs.map((s) => ({ tag: s.tag, text: s.text }));
      const userTurns = await this.prisma.counselingMessage.count({ where: { sessionId: session.id, role: 'user' } });
      aiProgress = Math.min(100, sgs.length * 12 + Math.min(userTurns, 8) * 4);
    }

    return {
      data: {
        student: { id: student.id, name: student.name, grade: student.grade, school: student.school, classroom: student.classroom },
        grades,
        aiProgress,
        signals,
        targets,
      },
    };
  }
}
