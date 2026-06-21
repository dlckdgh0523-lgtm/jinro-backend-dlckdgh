import { env } from './env';
import { logger } from './logger';

// Sentry 래퍼 — DSN이 있으면 실제 @sentry/node로 위임, 없으면 로그만(noop).
// 로컬/키 없을 때 무해: initSentry()는 DSN 없으면 즉시 스킵한다.
interface SentryLike {
  captureException(e: unknown, ctx?: Record<string, unknown>): void;
}

class NoopSentry implements SentryLike {
  captureException(e: unknown, ctx?: Record<string, unknown>): void {
    logger.error({ err: e instanceof Error ? e.message : String(e), ...ctx }, 'sentry(noop) captureException');
  }
}

class RealSentry implements SentryLike {
  // 동적 require — DSN 없으면 모듈을 건드리지 않는다.
  constructor(private readonly sdk: typeof import('@sentry/node')) {}
  captureException(e: unknown, ctx?: Record<string, unknown>): void {
    this.sdk.captureException(e, ctx ? { extra: ctx } : undefined);
    // 로컬 디버깅을 위해 로그도 남긴다(노이즈는 5xx에서만 호출되므로 적음).
    logger.error({ err: e instanceof Error ? e.message : String(e), ...ctx }, 'sentry captureException');
  }
}

let instance: SentryLike | null = null;

/**
 * 부팅 시 1회 호출. SENTRY_DSN이 있으면 @sentry/node를 init하고 실제 인스턴스로 전환.
 * 없으면 아무것도 하지 않는다(noop 유지) — 로컬/키 없을 때 무해.
 * main.ts / worker.ts 양쪽에서 호출한다.
 */
export function initSentry(): void {
  const dsn = env().SENTRY_DSN;
  if (!dsn) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sdk = require('@sentry/node') as typeof import('@sentry/node');
    sdk.init({ dsn, tracesSampleRate: 0.1, environment: env().NODE_ENV });
    instance = new RealSentry(sdk);
    logger.info({ environment: env().NODE_ENV }, 'sentry initialized');
  } catch (e) {
    // SDK 로드/초기화 실패는 치명적이지 않다 — noop으로 폴백.
    logger.warn({ err: e instanceof Error ? e.message : String(e) }, 'sentry init failed — using noop');
  }
}

export function sentry(): SentryLike {
  if (!instance) instance = new NoopSentry();
  return instance;
}
