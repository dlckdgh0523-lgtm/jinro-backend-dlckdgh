import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
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

const recentQuery = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

const actionBody = z.object({
  reason: z.string().trim().max(300).optional(),
});

const createUserBody = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(120),
  role: z.enum(['student', 'teacher', 'admin']),
});

// 관리자 초대용 임시 비밀번호 — 영숫자 12자(≥8 정책 충족).
function tempPassword(): string {
  return 'Jn' + randomBytes(8).toString('base64url').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
}

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

  // 알림 이벤트 — 전체 사용자에게 발송된 알림(dedupeKey 파이프라인) 최근 순.
  @Get('notifications')
  async notifications(@Req() req: Request, @Query() query: Record<string, string>) {
    requireAdmin(req);
    const { limit } = parseOrThrow(recentQuery, query);
    const rows = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { name: true, email: true, role: true } } },
    });
    return {
      data: rows.map((n) => ({
        id: n.id,
        type: n.type,
        dedupeKey: n.dedupeKey,
        title: n.title,
        body: n.body,
        targetUrl: n.targetUrl,
        read: n.readAt !== null,
        createdAt: n.createdAt,
        user: n.user.name,
        email: n.user.email,
        role: n.user.role,
      })),
      meta: { count: rows.length },
    };
  }

  // 감사 로그 — 관리자 조치 기록 최근 순.
  @Get('audit-logs')
  async auditLogs(@Req() req: Request, @Query() query: Record<string, string>) {
    requireAdmin(req);
    const { limit } = parseOrThrow(recentQuery, query);
    const rows = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { actor: { select: { name: true, email: true } } },
    });
    return {
      data: rows.map((a) => ({
        id: a.id,
        action: a.action,
        summary: a.summary,
        reason: a.reason,
        targetType: a.targetType,
        targetId: a.targetId,
        actor: a.actor.name,
        actorEmail: a.actor.email,
        createdAt: a.createdAt,
      })),
      meta: { count: rows.length },
    };
  }

  // 계정 비활성화 — 실제 status 변경 + 감사 로그.
  @Post('users/:id/disable')
  async disableUser(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const admin = requireAdmin(req);
    const { reason } = parseOrThrow(actionBody, (body as object) ?? {});
    const target = await this.prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, status: true } });
    if (!target) throw new AppError(ErrorCode.NOT_FOUND, '사용자를 찾을 수 없어요.');
    if (target.id === admin.id) throw new AppError(ErrorCode.CONFLICT, '본인 계정은 비활성화할 수 없어요.');
    await this.prisma.user.update({ where: { id }, data: { status: 'disabled' } });
    await this.recordAudit(admin, 'user.disable', `${target.name}(${target.email}) 계정 비활성화`, { targetType: 'user', targetId: id, reason });
    return { data: { ok: true, id, status: 'disabled' } };
  }

  // 계정 활성화(복구) — status 변경 + 감사 로그.
  @Post('users/:id/enable')
  async enableUser(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const admin = requireAdmin(req);
    const { reason } = parseOrThrow(actionBody, (body as object) ?? {});
    const target = await this.prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } });
    if (!target) throw new AppError(ErrorCode.NOT_FOUND, '사용자를 찾을 수 없어요.');
    await this.prisma.user.update({ where: { id }, data: { status: 'active' } });
    await this.recordAudit(admin, 'user.enable', `${target.name}(${target.email}) 계정 활성화`, { targetType: 'user', targetId: id, reason });
    return { data: { ok: true, id, status: 'active' } };
  }

  // 사용자 추가 — 임시 비밀번호로 계정 생성 + 감사 로그. 임시 비번을 응답으로 1회 반환.
  @Post('users')
  async createUser(@Req() req: Request, @Body() body: unknown) {
    const admin = requireAdmin(req);
    const { name, email, role } = parseOrThrow(createUserBody, (body as object) ?? {});
    const existing = await this.prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) throw new AppError(ErrorCode.AUTH_EMAIL_TAKEN, '이미 가입된 이메일이에요.');
    const pw = tempPassword();
    const passwordHash = await bcrypt.hash(pw, 10);
    const consents = { tos: true, privacy: true, academic: true, ai: true, age: true } as object;
    const user = await this.prisma.user.create({
      data: { email, name, role, passwordHash, consents, ...(role === 'student' ? { grade: 'H1' } : {}) },
      select: { id: true, name: true, email: true, role: true },
    });
    await this.recordAudit(admin, 'user.create', `${name}(${email}) ${role} 계정 생성`, { targetType: 'user', targetId: user.id });
    return { data: { ...user, tempPassword: pw } };
  }

  // 감사 로그 기록 — 실패해도 본 액션을 막지 않도록 best-effort.
  private async recordAudit(
    actor: AuthUser,
    action: string,
    summary: string,
    opts: { targetType?: string; targetId?: string; reason?: string; meta?: object } = {},
  ): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: actor.id,
          action,
          summary,
          targetType: opts.targetType,
          targetId: opts.targetId,
          reason: opts.reason,
          meta: opts.meta,
        },
      });
    } catch {
      /* 감사 로그 저장 실패는 무시 */
    }
  }
}
