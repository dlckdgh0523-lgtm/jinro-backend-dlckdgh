import type Redis from 'ioredis';
import { logger } from '../common/logger';

// Redis 캐시 + single-flight(동시 캐시미스 합치기)로 스탬피드 방지 (DECISIONS #17).
// Redis가 죽어 있으면 캐시 없이 loader 직행 — 캐시는 가용성 최적화일 뿐 정합성 의존 금지.

export const TTL = {
  jobs: 6 * 3600,
  juniorJobs: 6 * 3600,
  majors: 24 * 3600,
  schools: 24 * 3600,
  counsel: 12 * 3600,
  cose: 12 * 3600,
  tests: 24 * 3600,
} as const;

export class CacheService {
  private inflight = new Map<string, Promise<unknown>>();

  constructor(private readonly redis: Redis) {}

  async getOrLoad<T>(key: string, ttlSec: number, loader: () => Promise<T>): Promise<{ value: T; hit: boolean }> {
    // 1) Redis 조회 (실패해도 통과)
    try {
      const cached = await this.redis.get(key);
      if (cached !== null) return { value: JSON.parse(cached) as T, hit: true };
    } catch (e) {
      logger.warn({ key, err: (e as Error).message }, 'cache get failed — bypassing');
    }

    // 2) single-flight — 같은 키 동시 미스는 한 번만 적재
    const existing = this.inflight.get(key);
    if (existing) {
      return { value: (await existing) as T, hit: true };
    }

    const p = (async () => {
      try {
        const value = await loader();
        try {
          await this.redis.set(key, JSON.stringify(value), 'EX', ttlSec);
        } catch (e) {
          logger.warn({ key, err: (e as Error).message }, 'cache set failed');
        }
        return value;
      } finally {
        this.inflight.delete(key);
      }
    })();
    this.inflight.set(key, p);
    return { value: (await p) as T, hit: false };
  }

  async invalidate(prefix: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`${prefix}*`);
      if (keys.length) await this.redis.del(...keys);
    } catch (e) {
      logger.warn({ prefix, err: (e as Error).message }, 'cache invalidate failed');
    }
  }
}
