import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, bootTestApp, signupStudent, type TestContext } from '../helpers/test-app';

describe('인증 — 계약(§1) + 표준 에러 형태', () => {
  let ctx: TestContext;

  beforeAll(async () => {
    ctx = await bootTestApp();
  });
  afterAll(async () => {
    await ctx.close();
  });

  it('학생 가입 → {accessToken, refreshToken, user} (계약 §1)', async () => {
    const u = await signupStudent(ctx.baseUrl);
    expect(u.accessToken).toBeTruthy();
    expect(u.refreshToken).toBeTruthy();
    expect(u.user).toMatchObject({ role: 'student' });
  });

  it('교사 가입 → school/classroom 포함', async () => {
    const res = await api(ctx.baseUrl, null, 'POST', '/v1/auth/signup/teacher', {
      email: `teacher-${Date.now()}@test.kr`,
      password: 'password123!',
      name: '이교사',
      school: '한빛고',
      classroom: '2-3',
      consents: { tos: true, privacy: true, academic: true, ai: true, age: true },
    });
    expect(res.status).toBe(201);
    expect(res.json.user).toMatchObject({ role: 'teacher', school: '한빛고', classroom: '2-3' });
  });

  it('필수 동의 누락 → 400 AUTH_CONSENT_REQUIRED, age 미동의 → 403 AUTH_AGE_RESTRICTED', async () => {
    const base = { email: `c-${Date.now()}@test.kr`, password: 'password123!', name: 'x' };
    const noAi = await api(ctx.baseUrl, null, 'POST', '/v1/auth/signup/student', {
      ...base,
      consents: { tos: true, privacy: true, academic: true, ai: false, age: true },
    });
    expect(noAi.status).toBe(400);
    expect(noAi.json.code).toBe('AUTH_CONSENT_REQUIRED');
    expect(noAi.json.error.code).toBe('AUTH_CONSENT_REQUIRED'); // 병합 형태

    const noAge = await api(ctx.baseUrl, null, 'POST', '/v1/auth/signup/student', {
      ...base,
      email: `c2-${Date.now()}@test.kr`,
      consents: { tos: true, privacy: true, academic: true, ai: true, age: false },
    });
    expect(noAge.status).toBe(403);
    expect(noAge.json.code).toBe('AUTH_AGE_RESTRICTED');
  });

  it('중복 이메일 → 409 AUTH_EMAIL_TAKEN', async () => {
    const u = await signupStudent(ctx.baseUrl);
    const dup = await api(ctx.baseUrl, null, 'POST', '/v1/auth/signup/student', {
      email: u.user.email,
      password: 'password123!',
      name: 'dup',
      consents: { tos: true, privacy: true, academic: true, ai: true, age: true },
    });
    expect(dup.status).toBe(409);
    expect(dup.json.code).toBe('AUTH_EMAIL_TAKEN');
  });

  it('로그인 성공 → user+nextPath / 실패 → 401 (이메일 존재 노출 없음)', async () => {
    const u = await signupStudent(ctx.baseUrl);
    const ok = await api(ctx.baseUrl, null, 'POST', '/v1/auth/login', { email: u.user.email, password: 'password123!' });
    expect(ok.status).toBe(200);
    expect(ok.json.nextPath).toBe('/student/dashboard');

    const bad = await api(ctx.baseUrl, null, 'POST', '/v1/auth/login', { email: u.user.email, password: 'wrong-password' });
    expect(bad.status).toBe(401);
    expect(bad.json.code).toBe('AUTH_INVALID_CREDENTIALS');
    const ghost = await api(ctx.baseUrl, null, 'POST', '/v1/auth/login', { email: 'no-such@test.kr', password: 'x'.repeat(10) });
    expect(ghost.json.code).toBe('AUTH_INVALID_CREDENTIALS'); // 동일 메시지
  });

  it('refresh 회전 — 새 토큰 발급 + 구 refresh 재사용 거부', async () => {
    const u = await signupStudent(ctx.baseUrl);
    const r1 = await api(ctx.baseUrl, null, 'POST', '/v1/auth/refresh', { refreshToken: u.refreshToken });
    expect(r1.status).toBe(200);
    expect(r1.json.accessToken).toBeTruthy();
    // 401-replay 계약(app-runtime.jsx:126): 새 accessToken으로 인증 가능
    const me = await api(ctx.baseUrl, r1.json.accessToken, 'GET', '/v1/auth/me');
    expect(me.status).toBe(200);
    // 회전된 구 토큰 재사용 → 401
    const replay = await api(ctx.baseUrl, null, 'POST', '/v1/auth/refresh', { refreshToken: u.refreshToken });
    expect(replay.status).toBe(401);
    expect(replay.json.code).toBe('AUTH_EXPIRED');
  });

  it('logout → 모든 refresh 폐기', async () => {
    const u = await signupStudent(ctx.baseUrl);
    const out = await api(ctx.baseUrl, u.accessToken, 'POST', '/v1/auth/logout');
    expect(out.status).toBe(200);
    expect(out.json.ok).toBe(true);
    const r = await api(ctx.baseUrl, null, 'POST', '/v1/auth/refresh', { refreshToken: u.refreshToken });
    expect(r.status).toBe(401);
  });

  it('보호 라우트 — 토큰 없음/위조 → 401 표준 에러', async () => {
    const none = await api(ctx.baseUrl, null, 'GET', '/v1/auth/me');
    expect(none.status).toBe(401);
    expect(none.json.traceId).toBeTruthy();
    const forged = await api(ctx.baseUrl, 'fake.token.value', 'GET', '/v1/auth/me');
    expect(forged.status).toBe(401);
    expect(forged.json.code).toBe('AUTH_EXPIRED');
  });

  it('미구현 라우트 → 501 NOT_IMPLEMENTED (500 누수 없음)', async () => {
    for (const p of ['/v1/auth/google/callback', '/v1/auth/kakao/callback', '/v1/auth/password/forgot', '/v1/auth/find-id']) {
      const res = await api(ctx.baseUrl, null, 'POST', p, {});
      expect(res.status).toBe(501);
      expect(res.json.code).toBe('NOT_IMPLEMENTED');
    }
  });
});
