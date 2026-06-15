import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { StorageService } from '../../src/common/storage';
import { toErrorBody, AppError, ErrorCode } from '../../src/common/errors';
import { loadEnv, resetEnvForTest } from '../../src/common/env';

describe('storage — presigned-유사 서명 URL', () => {
  let storage: StorageService;

  beforeEach(() => {
    resetEnvForTest();
    loadEnv({ LOCAL_STORAGE_DIR: mkdtempSync(join(tmpdir(), 'jinro-st-')), FILE_URL_SECRET: 'unit-secret' });
    storage = new StorageService();
  });

  it('put → 서명 URL → 검증 통과 → get 일치', async () => {
    await storage.put('reports/x.pdf', Buffer.from('%PDF-fake'), 'application/pdf');
    const url = new URL(storage.getSignedUrl('reports/x.pdf', 60));
    const sig = url.searchParams.get('sig')!;
    const expires = Number(url.searchParams.get('expires'));
    expect(storage.verifySignature('reports/x.pdf', expires, sig)).toBe(true);
    const { body, contentType } = await storage.get('reports/x.pdf');
    expect(body.toString()).toBe('%PDF-fake');
    expect(contentType).toBe('application/pdf');
  });

  it('만료/위조 서명 거부', () => {
    const url = new URL(storage.getSignedUrl('reports/x.pdf', 60));
    const sig = url.searchParams.get('sig')!;
    expect(storage.verifySignature('reports/x.pdf', Math.floor(Date.now() / 1000) - 10, sig)).toBe(false); // 만료
    expect(storage.verifySignature('reports/x.pdf', Number(url.searchParams.get('expires')), 'ff'.repeat(32))).toBe(false); // 위조
    expect(storage.verifySignature('reports/other.pdf', Number(url.searchParams.get('expires')), sig)).toBe(false); // 키 바꿔치기
  });

  it('경로 탈출 차단', async () => {
    await expect(storage.put('../../evil.txt', Buffer.from('x'), 'text/plain')).rejects.toThrow();
  });
});

describe('표준 에러 형태 (DECISIONS #7 병합 형태)', () => {
  it('최상위 + 중첩 error 동시 포함', () => {
    const body = toErrorBody('CAREERNET_UPSTREAM_TIMEOUT', '지연되고 있어요', 'trace-1', { hint: 1 });
    expect(body.code).toBe('CAREERNET_UPSTREAM_TIMEOUT');
    expect(body.message).toBe('지연되고 있어요');
    expect(body.traceId).toBe('trace-1');
    expect(body.details).toEqual({ hint: 1 });
    expect(body.error).toEqual({ code: 'CAREERNET_UPSTREAM_TIMEOUT', message: '지연되고 있어요', traceId: 'trace-1' });
  });

  it('AppError 기본 status 매핑', () => {
    expect(new AppError(ErrorCode.AI_RATE_LIMITED, 'm').status).toBe(429);
    expect(new AppError(ErrorCode.CAREERNET_CIRCUIT_OPEN, 'm').status).toBe(503);
    expect(new AppError(ErrorCode.VALIDATION_FAILED, 'm').status).toBe(400);
    expect(new AppError(ErrorCode.AUTH_EMAIL_TAKEN, 'm').status).toBe(409);
  });
});
