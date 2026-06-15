// 도메인별 에러코드 enum + 표준 에러 형태.
// 응답 형태(DECISIONS #7): 최상위 {code,message,traceId,details?} + 중첩 {error:{code,message,traceId}}
// — 프론트(app-runtime.jsx:147)는 최상위를, 미션 규약은 중첩을 읽는다.

export enum ErrorCode {
  // VALIDATION_*
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  VALIDATION_TOO_LARGE = 'VALIDATION_TOO_LARGE',

  // AUTH_*
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',
  AUTH_EMAIL_TAKEN = 'AUTH_EMAIL_TAKEN',
  AUTH_CONSENT_REQUIRED = 'AUTH_CONSENT_REQUIRED',
  AUTH_AGE_RESTRICTED = 'AUTH_AGE_RESTRICTED',

  // CAREERNET_*
  CAREERNET_UPSTREAM_TIMEOUT = 'CAREERNET_UPSTREAM_TIMEOUT',
  CAREERNET_UPSTREAM_ERROR = 'CAREERNET_UPSTREAM_ERROR',
  CAREERNET_CIRCUIT_OPEN = 'CAREERNET_CIRCUIT_OPEN',
  CAREERNET_PARSE_ERROR = 'CAREERNET_PARSE_ERROR',
  CAREERNET_NOT_FOUND = 'CAREERNET_NOT_FOUND',

  // AI_*
  AI_RATE_LIMITED = 'AI_RATE_LIMITED',
  AI_OVERLOADED = 'AI_OVERLOADED',
  AI_CONTEXT_TOO_LARGE = 'AI_CONTEXT_TOO_LARGE',
  AI_CONTENT_FILTERED = 'AI_CONTENT_FILTERED',
  AI_STREAM_ABORTED = 'AI_STREAM_ABORTED',
  AI_UNAVAILABLE = 'AI_UNAVAILABLE',
  AI_SESSION_NOT_FOUND = 'AI_SESSION_NOT_FOUND',
  AI_NOT_ENOUGH_EVIDENCE = 'AI_NOT_ENOUGH_EVIDENCE',
  AI_TOO_MANY_STREAMS = 'AI_TOO_MANY_STREAMS',

  // PDF_* / REPORT_*
  PDF_JOB_NOT_FOUND = 'PDF_JOB_NOT_FOUND',
  PDF_RENDER_FAILED = 'PDF_RENDER_FAILED',
  REPORT_NOT_FOUND = 'REPORT_NOT_FOUND',

  // 공통
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL',
}

const DEFAULT_STATUS: Record<string, number> = {
  VALIDATION_FAILED: 400,
  VALIDATION_TOO_LARGE: 413,
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_EXPIRED: 401,
  AUTH_FORBIDDEN: 403,
  AUTH_EMAIL_TAKEN: 409,
  AUTH_CONSENT_REQUIRED: 400,
  AUTH_AGE_RESTRICTED: 403,
  CAREERNET_UPSTREAM_TIMEOUT: 503,
  CAREERNET_UPSTREAM_ERROR: 502,
  CAREERNET_CIRCUIT_OPEN: 503,
  CAREERNET_PARSE_ERROR: 502,
  CAREERNET_NOT_FOUND: 404,
  AI_RATE_LIMITED: 429,
  AI_OVERLOADED: 503,
  AI_CONTEXT_TOO_LARGE: 400,
  AI_CONTENT_FILTERED: 422,
  AI_STREAM_ABORTED: 499,
  AI_UNAVAILABLE: 503,
  AI_SESSION_NOT_FOUND: 404,
  AI_NOT_ENOUGH_EVIDENCE: 409,
  AI_TOO_MANY_STREAMS: 429,
  PDF_JOB_NOT_FOUND: 404,
  PDF_RENDER_FAILED: 500,
  REPORT_NOT_FOUND: 404,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  NOT_IMPLEMENTED: 501,
  CONFLICT: 409,
  INTERNAL: 500,
}

/** 도메인 에러 — 사용자 안전 메시지만 담는다. 내부 원인은 cause/log로. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ErrorCode, message: string, opts?: { status?: number; details?: unknown; cause?: unknown }) {
    super(message, { cause: opts?.cause });
    this.name = 'AppError';
    this.code = code;
    this.status = opts?.status ?? DEFAULT_STATUS[code] ?? 500;
    this.details = opts?.details;
  }
}

export interface ErrorBody {
  code: string;
  message: string;
  traceId: string;
  details?: unknown;
  error: { code: string; message: string; traceId: string };
}

export function toErrorBody(code: string, message: string, traceId: string, details?: unknown): ErrorBody {
  const body: ErrorBody = {
    code,
    message,
    traceId,
    error: { code, message, traceId },
  };
  if (details !== undefined) body.details = details;
  return body;
}
