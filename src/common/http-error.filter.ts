import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError, ErrorCode, toErrorBody } from './errors';
import { currentTraceId } from './trace';
import { logger } from './logger';
import { sentry } from './sentry';

// 전역 에러 필터 — 모든 미처리 예외를 표준 형태로. 내부 스택은 절대 응답에 싣지 않는다.
function isBodyParserError(e: unknown): e is { status: number; type: string } {
  const err = e as { status?: unknown; type?: unknown };
  return typeof err.status === 'number' && err.status >= 400 && err.status < 500 && typeof err.type === 'string' && err.type.startsWith('entity.');
}

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const traceId = currentTraceId();

    let status = 500;
    let code: string = ErrorCode.INTERNAL;
    let message = '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.';
    let details: unknown;

    if (exception instanceof AppError) {
      status = exception.status;
      code = exception.code;
      message = exception.message;
      details = exception.details;
    } else if (exception instanceof ZodError) {
      status = 400;
      code = ErrorCode.VALIDATION_FAILED;
      message = '입력값이 올바르지 않아요.';
      details = exception.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
    } else if (isBodyParserError(exception)) {
      // express.json()의 raw-body 에러 — 413(entity.too.large) / 400(entity.parse.failed 등)
      status = exception.status === 413 ? 413 : 400;
      code = status === 413 ? ErrorCode.VALIDATION_TOO_LARGE : ErrorCode.VALIDATION_FAILED;
      message = status === 413 ? '요청이 너무 커요. (최대 100KB)' : '요청 본문을 해석하지 못했어요.';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as Record<string, unknown> | string;
      code =
        status === 404 ? ErrorCode.NOT_FOUND
        : status === 429 ? ErrorCode.RATE_LIMITED
        : status === 403 ? ErrorCode.AUTH_FORBIDDEN
        : status === 401 ? ErrorCode.AUTH_EXPIRED
        : status === 413 ? ErrorCode.VALIDATION_TOO_LARGE
        : status >= 500 ? ErrorCode.INTERNAL
        : ErrorCode.VALIDATION_FAILED;
      if (typeof body === 'object' && body && typeof body['message'] === 'string') {
        message = status >= 500 ? message : (body['message'] as string);
      }
    }

    if (status >= 500) {
      logger.error(
        { err: exception instanceof Error ? { message: exception.message, stack: exception.stack } : String(exception), path: req.url },
        'unhandled error',
      );
      sentry().captureException(exception, { path: req.url, traceId });
    } else {
      logger.warn({ code, status, path: req.url }, 'request error');
    }

    // SSE 등 이미 헤더가 나간 응답에는 쓰지 않는다(프로세스 보호)
    if (res.headersSent) {
      res.end();
      return;
    }
    res.status(status).json(toErrorBody(code, message, traceId, details));
  }
}
