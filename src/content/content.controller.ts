import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { Request } from 'express';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

function user(req: Request): AuthUser {
  const u = (req as Request & { user?: AuthUser }).user;
  if (!u) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  return u;
}
function requireAdmin(req: Request): AuthUser {
  const u = user(req);
  if (u.role !== 'admin') throw new AppError(ErrorCode.AUTH_FORBIDDEN, '관리자 전용 기능이에요.');
  return u;
}

const createAnnouncement = z.object({
  title: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(5000),
  pinned: z.boolean().optional().default(false),
  audience: z.enum(['all', 'student', 'teacher']).optional().default('all'),
});
const createSuggestion = z.object({
  category: z.enum(['기능', '버그', '기타']).optional().default('기타'),
  body: z.string().trim().min(1).max(2000),
});
const updateSuggestion = z.object({
  status: z.enum(['open', 'reviewed', 'resolved']),
});
const listQuery = z.object({ limit: z.coerce.number().int().min(1).max(200).default(50) });

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly prisma: PrismaService) {}

  // ── 공지사항 ──

  // 모든 로그인 사용자 — 대상(audience)이 all 또는 본인 역할인 공지 최근순.
  @Get('announcements')
  async listAnnouncements(@Req() req: Request, @Query() query: Record<string, string>) {
    const u = user(req);
    const { limit } = parseOrThrow(listQuery, query);
    const rows = await this.prisma.announcement.findMany({
      where: { audience: { in: ['all', u.role] } },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      include: { author: { select: { name: true } } },
    });
    return {
      data: rows.map((a) => ({
        id: a.id, title: a.title, body: a.body, pinned: a.pinned,
        audience: a.audience, author: a.author.name, createdAt: a.createdAt,
      })),
      meta: { count: rows.length },
    };
  }

  @Post('admin/announcements')
  async createAnnouncement(@Req() req: Request, @Body() body: unknown) {
    const admin = requireAdmin(req);
    const f = parseOrThrow(createAnnouncement, (body as object) ?? {});
    const a = await this.prisma.announcement.create({
      data: { title: f.title, body: f.body, pinned: f.pinned, audience: f.audience, authorId: admin.id },
    });
    return { data: { id: a.id } };
  }

  @Delete('admin/announcements/:id')
  async deleteAnnouncement(@Req() req: Request, @Param('id') id: string) {
    requireAdmin(req);
    await this.prisma.announcement.deleteMany({ where: { id } });
    return { data: { ok: true } };
  }

  // ── 건의사항 ──

  // 학생/교사가 제출.
  @Post('suggestions')
  async createSuggestion(@Req() req: Request, @Body() body: unknown) {
    const u = user(req);
    const f = parseOrThrow(createSuggestion, (body as object) ?? {});
    const s = await this.prisma.suggestion.create({
      data: { userId: u.id, category: f.category, body: f.body },
    });
    return { data: { id: s.id } };
  }

  // 관리자 — 전체 건의사항 + 작성자.
  @Get('admin/suggestions')
  async listSuggestions(@Req() req: Request, @Query() query: Record<string, string>) {
    requireAdmin(req);
    const { limit } = parseOrThrow(listQuery, query);
    const rows = await this.prisma.suggestion.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: { select: { name: true, email: true, role: true } } },
    });
    return {
      data: rows.map((s) => ({
        id: s.id, category: s.category, body: s.body, status: s.status,
        author: s.user.name, email: s.user.email, role: s.user.role, createdAt: s.createdAt,
      })),
      meta: { count: rows.length },
    };
  }

  @Patch('admin/suggestions/:id')
  async updateSuggestion(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    requireAdmin(req);
    const { status } = parseOrThrow(updateSuggestion, (body as object) ?? {});
    await this.prisma.suggestion.updateMany({ where: { id }, data: { status } });
    return { data: { ok: true, status } };
  }
}
