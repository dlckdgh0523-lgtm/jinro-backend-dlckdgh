import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { Request } from 'express';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

function requireAdmin(req: Request): AuthUser {
  const user = (req as Request & { user?: AuthUser }).user;
  if (!user) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  if (user.role !== 'admin') throw new AppError(ErrorCode.AUTH_FORBIDDEN, '관리자 전용 기능이에요.');
  return user;
}

const usersQuery = z.object({
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

@Controller('v1/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  // 운영 대시보드 집계 — 실 카운트 (없으면 0).
  @Get('stats')
  async stats(@Req() req: Request) {
    requireAdmin(req);
    const [students, teachers, admins, active, sessions, messages, reports, grades, volunteers, scholarships, foreignUniv, departments] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'student' } }),
        this.prisma.user.count({ where: { role: 'teacher' } }),
        this.prisma.user.count({ where: { role: 'admin' } }),
        this.prisma.user.count({ where: { status: 'active' } }),
        this.prisma.counselingSession.count(),
        this.prisma.counselingMessage.count(),
        this.prisma.report.count(),
        this.prisma.grade.count(),
        this.prisma.volunteerOpportunity.count(),
        this.prisma.scholarship.count(),
        this.prisma.foreignUniversity.count(),
        this.prisma.universityDepartment.count(),
      ]);
    return {
      data: {
        users: { total: students + teachers + admins, students, teachers, admins, active },
        ai: { sessions, messages, reports },
        content: { grades, volunteers, scholarships, foreignUniv, departments },
      },
    };
  }

  // 사용자 목록 — role/검색 필터.
  @Get('users')
  async users(@Req() req: Request, @Query() query: Record<string, string>) {
    requireAdmin(req);
    const { role, q, limit } = parseOrThrow(usersQuery, query);
    const items = await this.prisma.user.findMany({
      where: {
        ...(role ? { role } : {}),
        ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] } : {}),
      },
      select: { id: true, name: true, email: true, role: true, school: true, classroom: true, grade: true, status: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { data: items, meta: { count: items.length } };
  }

  // AI 사용량 — 세션/메시지/리포트 집계 + 최근 세션.
  @Get('ai-usage')
  async aiUsage(@Req() req: Request) {
    requireAdmin(req);
    const [sessions, active, messages, reports, recent] = await Promise.all([
      this.prisma.counselingSession.count(),
      this.prisma.counselingSession.count({ where: { status: 'active' } }),
      this.prisma.counselingMessage.count(),
      this.prisma.report.count(),
      this.prisma.counselingSession.findMany({
        orderBy: { startedAt: 'desc' },
        take: 10,
        include: { user: { select: { name: true } }, _count: { select: { messages: true, signals: true } } },
      }),
    ]);
    return {
      data: {
        totals: { sessions, active, messages, reports },
        recent: recent.map((s) => ({
          id: s.id,
          student: s.user.name,
          status: s.status,
          startedAt: s.startedAt,
          messages: s._count.messages,
          signals: s._count.signals,
        })),
      },
    };
  }
}
