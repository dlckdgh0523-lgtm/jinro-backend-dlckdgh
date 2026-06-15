import { Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { NotificationsService } from './notifications.service';
import { PubSubService } from './pubsub.service';
import { SseConnection } from './sse';
import { JwtAuthGuard, type AuthedRequest } from '../auth/jwt.guard';
import { parseOrThrow, qLimit } from '../common/zod';

const listQuery = z.object({
  cursor: z.string().max(64).optional(),
  unreadOnly: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),
  limit: qLimit,
});

@Controller('v1/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly pubsub: PubSubService,
  ) {}

  @Get()
  list(@Req() req: AuthedRequest, @Query() query: Record<string, string>) {
    const { cursor, unreadOnly, limit } = parseOrThrow(listQuery, query);
    return this.notifications.list(req.user.id, cursor, unreadOnly, limit);
  }

  @Patch(':id/read')
  markRead(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.notifications.markRead(req.user.id, parseOrThrow(z.string().max(64), id));
  }

  @Post('read-all')
  markAllRead(@Req() req: AuthedRequest) {
    return this.notifications.markAllRead(req.user.id);
  }

  // 알림 SSE — EventSource 연결. Last-Event-ID(헤더 또는 ?lastEventId=)로 누락분 재전송.
  @Get('sse')
  async sse(@Req() req: AuthedRequest, @Res() res: Response): Promise<void> {
    const channel = `sse:user:${req.user.id}`;
    const conn = new SseConnection(res, req as Request);

    const lastIdRaw = (req.headers['last-event-id'] as string | undefined) ?? (req.query['lastEventId'] as string | undefined);
    const lastSeq = lastIdRaw && /^\d+$/.test(lastIdRaw) ? Number(lastIdRaw) : null;
    if (lastSeq !== null) {
      for (const ev of await this.pubsub.replaySince(channel, lastSeq)) {
        conn.send({ id: ev.seq, event: ev.event, data: ev.data });
      }
    }

    const unsubscribe = await this.pubsub.subscribe(channel, (ev) => {
      conn.send({ id: ev.seq, event: ev.event, data: ev.data });
    });
    conn.onClose(unsubscribe);
  }
}
