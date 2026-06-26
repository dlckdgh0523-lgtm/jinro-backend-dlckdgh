import pino from 'pino';
import { currentTraceId } from './trace';

// 전역 pino 인스턴스 — 모든 로그 라인에 traceId 자동 주입(AsyncLocalStorage).
// LOG_FILE이 설정되면 파일로 기록 (테스트 디버깅/수집용).
//
// PII/시크릿 redact — 학생 데이터 보호:
// 로그 유출/3자 공유 시에도 비밀번호·토큰·이메일·이름이 평문 노출되지 않게 자동 마스킹.
// password·token·refresh·secret·key는 완전 삭제, email·name은 일부만 보이는 형태로.
export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: undefined,
    mixin() {
      return { traceId: currentTraceId() };
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        // 완전 제거(시크릿)
        '*.password', '*.passwordHash', '*.hash',
        '*.accessToken', '*.refreshToken', '*.token',
        '*.serviceKey', '*.apiKey', '*.apikey', '*.secret', '*.authorization',
        'req.headers.authorization', 'req.headers.cookie',
        'headers.authorization', 'headers.cookie',
        // 학생 PII (이메일/이름은 마스킹은 호출 측 책임 — 여기선 그냥 제거)
        '*.email', '*.studentEmail', '*.userEmail',
        '*.name', '*.studentName', '*.userName',
        // body 내부의 흔한 키
        'body.password', 'body.passwordHash', 'body.email', 'body.name',
        'body.accessToken', 'body.refreshToken',
      ],
      censor: '[REDACTED]',
    },
  },
  process.env.LOG_FILE ? pino.destination({ dest: process.env.LOG_FILE, sync: true }) : undefined,
);
