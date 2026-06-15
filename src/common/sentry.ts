import { env } from './env';
import { logger } from './logger';

// Sentry no-op 래퍼 — DSN이 있으면 실제 SDK를 동적 로드, 없으면 로그만.
// (자율 빌드: @sentry/node 미설치 — DSN 투입 시 의존성 추가 필요. REPORT.md에 기재)
interface SentryLike {
  captureException(e: unknown, ctx?: Record<string, unknown>): void;
}

class NoopSentry implements SentryLike {
  captureException(e: unknown, ctx?: Record<string, unknown>): void {
    logger.error({ err: e instanceof Error ? e.message : String(e), ...ctx }, 'sentry(noop) captureException');
  }
}

let instance: SentryLike | null = null;

export function sentry(): SentryLike {
  if (!instance) {
    if (env().SENTRY_DSN) {
      logger.warn('SENTRY_DSN provided but @sentry/node is not bundled in this build — using noop (see REPORT.md)');
    }
    instance = new NoopSentry();
  }
  return instance;
}
