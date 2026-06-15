import pino from 'pino';
import { currentTraceId } from './trace';

// 전역 pino 인스턴스 — 모든 로그 라인에 traceId 자동 주입(AsyncLocalStorage).
// LOG_FILE이 설정되면 파일로 기록 (테스트 디버깅/수집용).
export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: undefined,
    mixin() {
      return { traceId: currentTraceId() };
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  process.env.LOG_FILE ? pino.destination({ dest: process.env.LOG_FILE, sync: true }) : undefined,
);
