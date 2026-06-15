import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

// Redis 연결 팩토리 — 역할별 분리(cache/pub/sub/bullmq). 끊김은 ioredis 자동 재연결에 맡기고
// 에러는 로그만(프로세스 보호 — 'error' 리스너 없으면 crash).
export function createRedis(name: string): Redis {
  const client = new Redis(env().REDIS_URL, {
    maxRetriesPerRequest: 2,
    enableOfflineQueue: true,
    lazyConnect: false,
    retryStrategy: (times) => Math.min(times * 200, 5_000),
  });
  client.on('error', (e) => logger.warn({ name, err: e.message }, 'redis error'));
  client.on('reconnecting', () => logger.info({ name }, 'redis reconnecting'));
  return client;
}

/** BullMQ 전용 연결 (blocking 명령 때문에 maxRetriesPerRequest: null 필수).
 *  bullmq가 자체 ioredis 타입(5.10)을 번들해 5.11과 명목상 불일치 — 런타임 호환이라 캐스팅. */
export function createBullRedis(): import('bullmq').ConnectionOptions {
  const client = new Redis(env().REDIS_URL, { maxRetriesPerRequest: null });
  client.on('error', (e) => logger.warn({ name: 'bullmq', err: e.message }, 'redis error'));
  return client as unknown as import('bullmq').ConnectionOptions;
}
