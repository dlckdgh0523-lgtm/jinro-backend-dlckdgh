import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { NotificationsService } from '../realtime/notifications.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

const eventSchema = z.object({
  title: z.string().trim().min(1).max(120),
  category: z.enum(['volunteer', 'experience', 'exam', 'counseling', 'study', 'other']),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  location: z.string().trim().max(160).optional(),
  contact: z.string().trim().max(40).optional(),
  link: z.string().trim().max(500).optional(),
  notes: z.string().trim().max(2000).optional(),
  refType: z.string().trim().max(40).optional(),
  refId: z.string().trim().max(80).optional(),
});

const querySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

function userId(req: Request): string {
  const id = (req as Request & { user?: { id?: string } }).user?.id;
  if (!id) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  return id;
}

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  @Get('calendar/events')
  async list(@Req() req: Request, @Query() query: Record<string, string>) {
    const uid = userId(req);
    const { from, to } = parseOrThrow(querySchema, query);
    const events = await this.prisma.calendarEvent.findMany({
      where: {
        userId: uid,
        ...(from || to
          ? { startsAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } }
          : {}),
      },
      orderBy: { startsAt: 'asc' },
    });
    return { data: events };
  }

  @Post('calendar/events')
  async create(@Req() req: Request, @Body() body: unknown) {
    const uid = userId(req);
    const input = parseOrThrow(eventSchema, body);
    // 멱등성: refType+refId 중복이면 기존 반환
    if (input.refType && input.refId) {
      const existing = await this.prisma.calendarEvent.findUnique({
        where: { userId_refType_refId: { userId: uid, refType: input.refType, refId: input.refId } },
      });
      if (existing) return { data: existing, meta: { idempotent: true } };
    }
    const created = await this.prisma.calendarEvent.create({
      data: {
        ...input,
        startsAt: new Date(input.startsAt),
        endsAt: input.endsAt ? new Date(input.endsAt) : null,
        userId: uid,
      },
    });
    return { data: created };
  }

  @Patch('calendar/events/:id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const uid = userId(req);
    const input = parseOrThrow(eventSchema.partial().extend({ reason: z.string().trim().max(300).optional() }), body);
    const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
    if (!event || event.userId !== uid) throw new AppError(ErrorCode.NOT_FOUND, '일정을 찾을 수 없어요.');
    const newStart = input.startsAt ? new Date(input.startsAt) : null;
    const updated = await this.prisma.calendarEvent.update({
      where: { id },
      data: {
        ...(({ reason, ...rest }) => rest)(input),
        ...(newStart ? { startsAt: newStart } : {}),
        ...(input.endsAt ? { endsAt: new Date(input.endsAt) } : {}),
      },
    });
    // 상담 일정 시간변경 → 상대(학생) 미러 이벤트도 갱신 + 사유 알림
    if (event.refType === 'counseling' && event.refId && newStart) {
      await this.notifyCounterparts(event.refType, event.refId, uid, newStart, {
        type: 'counseling.rescheduled',
        title: '상담 시간이 변경됐어요',
        body: `${fmtKo(newStart)}로 변경됐어요.${input.reason ? ` (사유: ${input.reason})` : ''}`,
        dedupeKey: `cal-resch-${event.refId}-${newStart.getTime()}`,
      });
    }
    return { data: updated };
  }

  @Delete('calendar/events/:id')
  async remove(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const uid = userId(req);
    const { reason } = parseOrThrow(z.object({ reason: z.string().trim().max(300).optional() }), body ?? {});
    const event = await this.prisma.calendarEvent.findUnique({ where: { id } });
    if (!event || event.userId !== uid) throw new AppError(ErrorCode.NOT_FOUND, '일정을 찾을 수 없어요.');
    await this.prisma.calendarEvent.delete({ where: { id } });
    // 상담 일정 취소 → 상대(학생) 미러 이벤트 삭제 + 사유 알림 + 요청 상태 cancelled
    if (event.refType === 'counseling' && event.refId) {
      const mirrors = await this.prisma.calendarEvent.findMany({ where: { refType: 'counseling', refId: event.refId, NOT: { userId: uid } } });
      for (const m of mirrors) {
        await this.prisma.calendarEvent.delete({ where: { id: m.id } }).catch(() => {});
        await this.notifications.notify(m.userId, {
          type: 'counseling.cancelled', dedupeKey: `cal-cancel-${event.refId}`,
          title: '상담 일정이 취소됐어요',
          body: reason ? `사유: ${reason}` : '선생님이 일정을 취소했어요. 다시 잡아주세요.',
          targetUrl: '#student-web',
        });
      }
      await this.prisma.counselingRequest.updateMany({ where: { id: event.refId }, data: { status: 'cancelled', decisionNote: reason ?? null } }).catch(() => {});
    }
    return { data: { id } };
  }

  // 상담 일정의 다른 참가자(학생)에게 알림 + 미러 이벤트 시간 갱신
  private async notifyCounterparts(refType: string, refId: string, actorId: string, newStart: Date, n: { type: string; title: string; body: string; dedupeKey: string }) {
    const mirrors = await this.prisma.calendarEvent.findMany({ where: { refType, refId, NOT: { userId: actorId } } });
    for (const m of mirrors) {
      await this.prisma.calendarEvent.update({ where: { id: m.id }, data: { startsAt: newStart } }).catch(() => {});
      await this.notifications.notify(m.userId, { type: n.type, dedupeKey: n.dedupeKey, title: n.title, body: n.body, targetUrl: '#student-web' });
    }
    await this.prisma.counselingRequest.updateMany({ where: { id: refId }, data: { scheduledAt: newStart } }).catch(() => {});
  }
}

function fmtKo(d: Date): string {
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
