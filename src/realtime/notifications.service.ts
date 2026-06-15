import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { PubSubService } from './pubsub.service';
import { logger } from '../common/logger';

// 알림 — DB 영속 + dedupeKey 멱등(unique [userId,dedupeKey]) + SSE 팬아웃.
// dedupeKey가 같으면 새 알림을 만들지 않는다 (프론트 토스트 폭격 방지, backend-integration.md §8).

export interface NotifyInput {
  type: string;
  dedupeKey: string;
  title: string;
  body: string;
  targetUrl?: string;
  payload?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pubsub: PubSubService,
  ) {}

  async notify(userId: string, input: NotifyInput): Promise<void> {
    let created = false;
    let id: string | null = null;
    try {
      const row = await this.prisma.notification.upsert({
        where: { userId_dedupeKey: { userId, dedupeKey: input.dedupeKey } },
        create: {
          userId,
          type: input.type,
          dedupeKey: input.dedupeKey,
          title: input.title,
          body: input.body,
          targetUrl: input.targetUrl,
          payload: input.payload as object | undefined,
        },
        update: {}, // 동일 dedupeKey 재발생은 무시 (멱등)
      });
      id = row.id;
      created = row.createdAt.getTime() > Date.now() - 5_000;
    } catch (e) {
      logger.warn({ userId, type: input.type, err: (e as Error).message }, 'notification persist failed');
      return;
    }
    if (!created) return;
    await this.pubsub.publish(`sse:user:${userId}`, input.type, {
      id,
      type: input.type,
      dedupeKey: input.dedupeKey,
      title: input.title,
      body: input.body,
      createdAt: new Date().toISOString(),
      targetUrl: input.targetUrl ?? null,
      payload: input.payload ?? null,
    });
  }

  async list(userId: string, cursor: string | undefined, unreadOnly: boolean, limit: number) {
    const where = { userId, ...(unreadOnly ? { readAt: null } : {}) };
    const rows = await this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      take: limit + 1,
    });
    const page = rows.slice(0, limit);
    return {
      data: page.map((n) => ({
        id: n.id,
        type: n.type,
        dedupeKey: n.dedupeKey,
        title: n.title,
        body: n.body,
        createdAt: n.createdAt.toISOString(),
        targetUrl: n.targetUrl,
        payload: n.payload,
        read: n.readAt !== null,
      })),
      meta: { nextCursor: rows.length > limit ? (page[page.length - 1]?.id ?? null) : null },
    };
  }

  async markRead(userId: string, id: string) {
    await this.prisma.notification.updateMany({ where: { id, userId }, data: { readAt: new Date() } });
    return { data: { ok: true as const } };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
    return { data: { ok: true as const } };
  }
}
