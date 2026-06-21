import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { NotificationsService } from '../realtime/notifications.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

const sendSchema = z.object({
  recipientId: z.string().trim().min(1),
  body: z.string().trim().min(1).max(2000),
});

function userId(req: Request): string {
  const id = (req as Request & { user?: { id?: string } }).user?.id;
  if (!id) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  return id;
}

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // 연락 가능 상대 — 학생: 같은 학교/반 교사, 교사: 같은 학교/반 학생.
  // 스코핑: 학생/교사는 반드시 같은 school+classroom 으로 제한한다. 학급 정보가 없으면(미배정)
  // 전체 교사/학생을 무차별 노출하지 않고 빈 목록을 돌려준다(스코핑 누락 방지). admin만 예외.
  @Get('messages/contacts')
  async contacts(@Req() req: Request) {
    const uid = userId(req);
    const me = await this.prisma.user.findUnique({ where: { id: uid } });
    if (!me) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
    if (me.role === 'admin') {
      const list = await this.prisma.user.findMany({
        where: { status: 'active', id: { not: uid } },
        select: { id: true, name: true, role: true, school: true, classroom: true },
        take: 100,
      });
      return { data: list };
    }
    const targetRole = me.role === 'teacher' ? 'student' : 'teacher';
    // 학급 미배정 학생/교사는 연락 대상 없음 — 무차별 노출 차단.
    if (!me.school || !me.classroom) return { data: [] };
    const list = await this.prisma.user.findMany({
      where: {
        role: targetRole,
        status: 'active',
        school: me.school,
        classroom: me.classroom,
      },
      select: { id: true, name: true, role: true, school: true, classroom: true },
      take: 100,
    });
    return { data: list };
  }

  // 스레드 목록 — 상대별 최근 메시지 + 안읽음 수
  @Get('messages/threads')
  async threads(@Req() req: Request) {
    const uid = userId(req);
    const msgs = await this.prisma.message.findMany({
      where: { OR: [{ senderId: uid }, { recipientId: uid }] },
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: { sender: { select: { id: true, name: true } }, recipient: { select: { id: true, name: true } } },
    });
    const threads = new Map<string, { otherId: string; otherName: string; lastBody: string; lastAt: Date; unread: number }>();
    for (const m of msgs) {
      const isMine = m.senderId === uid;
      const otherId = isMine ? m.recipientId : m.senderId;
      const otherName = isMine ? m.recipient.name : m.sender.name;
      if (!threads.has(otherId)) {
        threads.set(otherId, { otherId, otherName, lastBody: m.body, lastAt: m.createdAt, unread: 0 });
      }
      if (!isMine && !m.readAt) threads.get(otherId)!.unread += 1;
    }
    return { data: [...threads.values()] };
  }

  // 특정 상대와의 대화 — 조회 시 받은 메시지 읽음 처리
  @Get('messages')
  async conversation(@Req() req: Request, @Query('with') withId: string) {
    const uid = userId(req);
    if (!withId) throw new AppError(ErrorCode.VALIDATION_FAILED, 'with 파라미터가 필요해요.');
    const msgs = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: uid, recipientId: withId },
          { senderId: withId, recipientId: uid },
        ],
      },
      orderBy: { createdAt: 'asc' },
      take: 500,
    });
    await this.prisma.message.updateMany({
      where: { senderId: withId, recipientId: uid, readAt: null },
      data: { readAt: new Date() },
    });
    return { data: msgs.map((m) => ({ id: m.id, body: m.body, mine: m.senderId === uid, createdAt: m.createdAt, readAt: m.readAt })) };
  }

  @Post('messages')
  async send(@Req() req: Request, @Body() body: unknown) {
    const uid = userId(req);
    const input = parseOrThrow(sendSchema, body);
    if (input.recipientId === uid) throw new AppError(ErrorCode.VALIDATION_FAILED, '자기 자신에게는 보낼 수 없어요.');
    const recipient = await this.prisma.user.findUnique({ where: { id: input.recipientId } });
    if (!recipient) throw new AppError(ErrorCode.NOT_FOUND, '받는 사람을 찾을 수 없어요.');
    const sender = await this.prisma.user.findUnique({ where: { id: uid } });
    if (!sender) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
    // 스코핑: admin이 아니면 같은 school+classroom 인 상대에게만 보낼 수 있다.
    // (contacts 목록을 우회해 임의 recipientId를 보내는 것을 막는다.)
    if (sender.role !== 'admin' && recipient.role !== 'admin') {
      const sameClass = !!sender.school && !!sender.classroom && sender.school === recipient.school && sender.classroom === recipient.classroom;
      if (!sameClass) throw new AppError(ErrorCode.AUTH_FORBIDDEN, '같은 학급 사용자에게만 메시지를 보낼 수 있어요.');
    }
    const created = await this.prisma.message.create({ data: { senderId: uid, recipientId: input.recipientId, body: input.body } });
    // 수신자에게 알림 — 메시지마다 고유(dedupeKey=메시지 id), 스레드는 발신자 기준 경로
    const senderName = sender.name ?? '누군가';
    const preview = input.body.length > 60 ? input.body.slice(0, 60) + '…' : input.body;
    await this.notifications.notify(input.recipientId, {
      type: 'message.received',
      dedupeKey: `msg-${created.id}`,
      title: `${senderName} 새 메시지`,
      body: preview,
      targetUrl: `/messages?with=${uid}`,
      payload: { messageId: created.id, senderId: uid },
    });
    return { data: { id: created.id, body: created.body, mine: true, createdAt: created.createdAt } };
  }
}
