import { Injectable, OnModuleDestroy } from '@nestjs/common';
import type Redis from 'ioredis';
import { createRedis } from '../common/redis';
import { logger } from '../common/logger';

// 멀티 인스턴스 SSE 팬아웃 — Redis Pub/Sub (DECISIONS #22).
// 재전송(Last-Event-ID)용 이벤트 버퍼는 Redis LIST(최근 200건/60분) (DECISIONS #28).

export interface BufferedEvent {
  seq: number;
  event: string;
  data: unknown;
}

const BUFFER_MAX = 200;
const BUFFER_TTL_SEC = 3600;

@Injectable()
export class PubSubService implements OnModuleDestroy {
  private pub: Redis;
  private sub: Redis;
  private handlers = new Map<string, Set<(ev: BufferedEvent) => void>>();

  constructor() {
    this.pub = createRedis('sse-pub');
    this.sub = createRedis('sse-sub');
    this.sub.on('message', (channel: string, message: string) => {
      const set = this.handlers.get(channel);
      if (!set || set.size === 0) return;
      try {
        const ev = JSON.parse(message) as BufferedEvent;
        for (const h of set) h(ev);
      } catch (e) {
        logger.warn({ channel, err: (e as Error).message }, 'pubsub message parse failed');
      }
    });
  }

  /** 이벤트 발행: seq 부여 → 버퍼 적재 → PUBLISH. 워커/다른 인스턴스에서도 동일 API. */
  async publish(channel: string, event: string, data: unknown): Promise<number> {
    const seqKey = `sse:seq:${channel}`;
    const bufKey = `sse:buf:${channel}`;
    let seq = Date.now(); // Redis 불능 시 폴백 id (단조 증가는 보장 못하지만 연결은 유지)
    try {
      seq = await this.pub.incr(seqKey);
      const entry = JSON.stringify({ seq, event, data } satisfies BufferedEvent);
      await this.pub
        .multi()
        .rpush(bufKey, entry)
        .ltrim(bufKey, -BUFFER_MAX, -1)
        .expire(bufKey, BUFFER_TTL_SEC)
        .expire(seqKey, BUFFER_TTL_SEC)
        .publish(channel, entry)
        .exec();
    } catch (e) {
      logger.warn({ channel, err: (e as Error).message }, 'pubsub publish failed');
    }
    return seq;
  }

  /** lastEventId 이후 누락분 재전송용 버퍼 조회 */
  async replaySince(channel: string, lastSeq: number): Promise<BufferedEvent[]> {
    try {
      const raw = await this.pub.lrange(`sse:buf:${channel}`, 0, -1);
      return raw
        .map((r) => {
          try {
            return JSON.parse(r) as BufferedEvent;
          } catch {
            return null;
          }
        })
        .filter((ev): ev is BufferedEvent => ev !== null && ev.seq > lastSeq);
    } catch (e) {
      logger.warn({ channel, err: (e as Error).message }, 'pubsub replay failed');
      return [];
    }
  }

  async subscribe(channel: string, handler: (ev: BufferedEvent) => void): Promise<() => void> {
    let set = this.handlers.get(channel);
    if (!set) {
      set = new Set();
      this.handlers.set(channel, set);
      try {
        await this.sub.subscribe(channel);
      } catch (e) {
        logger.warn({ channel, err: (e as Error).message }, 'pubsub subscribe failed');
      }
    }
    set.add(handler);
    return () => {
      const s = this.handlers.get(channel);
      if (!s) return;
      s.delete(handler);
      if (s.size === 0) {
        this.handlers.delete(channel);
        this.sub.unsubscribe(channel).catch((e: Error) => logger.warn({ channel, err: e.message }, 'unsubscribe failed'));
      }
    };
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.allSettled([this.pub.quit(), this.sub.quit()]);
  }
}
