import Redis from 'ioredis';
import { afterAll, describe, expect, it } from 'vitest';
import { CacheService } from '../../src/career/cache';

describe('캐시 우아한 강등 — Redis 불능 시 loader 직행 (프로세스 생존)', () => {
  // 닫힌 포트로 연결 — 모든 명령이 실패하는 Redis
  const dead = new Redis('redis://127.0.0.1:9', {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null, // 재연결 포기
    enableOfflineQueue: false,
    lazyConnect: true,
  });
  dead.on('error', () => undefined);

  afterAll(() => {
    dead.disconnect();
  });

  it('get/set 실패해도 값을 반환하고 예외를 삼키지 않는다', async () => {
    const cache = new CacheService(dead);
    let calls = 0;
    const r1 = await cache.getOrLoad('k', 60, async () => {
      calls += 1;
      return { ok: true };
    });
    expect(r1.value).toEqual({ ok: true });
    expect(calls).toBe(1);
    // 캐시가 죽었으니 매번 loader — 그러나 single-flight는 동시 호출을 합친다
    const [a, b] = await Promise.all([
      cache.getOrLoad('k2', 60, async () => {
        calls += 1;
        await new Promise((r) => setTimeout(r, 50));
        return 'v';
      }),
      cache.getOrLoad('k2', 60, async () => {
        calls += 1;
        return 'v';
      }),
    ]);
    expect(a.value).toBe('v');
    expect(b.value).toBe('v');
    expect(calls).toBe(2); // k 1회 + k2 동시 2건은 1회로 합쳐짐
  });

  it('loader 자체가 던지면 에러는 전파된다 (삼키지 않음)', async () => {
    const cache = new CacheService(dead);
    await expect(cache.getOrLoad('k3', 60, async () => Promise.reject(new Error('upstream down')))).rejects.toThrow('upstream down');
    // 실패한 inflight가 남아 다음 호출을 막지 않는지
    const ok = await cache.getOrLoad('k3', 60, async () => 'recovered');
    expect(ok.value).toBe('recovered');
  });
});
