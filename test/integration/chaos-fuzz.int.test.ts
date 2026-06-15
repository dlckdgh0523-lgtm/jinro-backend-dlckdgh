import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, bootTestApp, signupStudent, type TestContext, type TestUser } from '../helpers/test-app';

// 입력 퍼징 — "사용자가 어떤 행동을 해도" 400/표준 에러, 500 누수 없음 (미션 P6)

const INJECTIONS = [
  "' OR 1=1 --",
  '<script>alert(1)</script>',
  '{{constructor.constructor("return 1")()}}',
  '../../etc/passwd',
  '\u0000',
  '🤖'.repeat(50),
  ']]>><dataSearch>',
];

describe('카오스/엣지 — 입력 퍼징 + 경계', () => {
  let ctx: TestContext;
  let user: TestUser;

  beforeAll(async () => {
    ctx = await bootTestApp({ LOG_LEVEL: 'error' });
    user = await signupStudent(ctx.baseUrl);
  });
  afterAll(async () => {
    await ctx.close();
  });

  function expectStandardError(res: { status: number; json: any }, allowed: number[]): void {
    expect(allowed, `status ${res.status} body ${JSON.stringify(res.json)}`).toContain(res.status);
    expect(res.json).toBeTruthy();
    expect(res.json.code).toBeTruthy();
    expect(res.json.message).toBeTruthy();
    expect(res.json.traceId).toBeTruthy();
    expect(res.json.error.code).toBe(res.json.code);
    expect(JSON.stringify(res.json)).not.toMatch(/\bat\s+\w+\.|node_modules|prisma\./); // 스택/내부 누수 금지
  }

  it('가입 퍼징 — 누락/타입오류/초과길이/인젝션 전부 4xx 표준 에러', async () => {
    const cases: unknown[] = [
      {},
      { email: 'not-an-email', password: 'password123', name: 'x', consents: { tos: true, privacy: true, academic: true, ai: true, age: true } },
      { email: 'a@b.kr', password: 'short', name: 'x', consents: { tos: true, privacy: true, academic: true, ai: true, age: true } },
      { email: 'a@b.kr', password: 'password123', name: 'x', consents: 'yes' },
      { email: 'a@b.kr', password: 12345678, name: 'x', consents: { tos: true, privacy: true, academic: true, ai: true, age: true } },
      { email: `${'x'.repeat(300)}@b.kr`, password: 'password123', name: 'x', consents: { tos: true, privacy: true, academic: true, ai: true, age: true } },
      ...INJECTIONS.map((inj) => ({ email: inj, password: 'password123', name: inj, consents: { tos: true, privacy: true, academic: true, ai: true, age: true } })),
    ];
    for (const body of cases) {
      const res = await api(ctx.baseUrl, null, 'POST', '/v1/auth/signup/student', body);
      expectStandardError(res, [400, 403, 413]);
    }
  });

  it('커리어 쿼리 퍼징 — limit/cursor 비정상, 검색어 인젝션', async () => {
    const urls = [
      '/v1/career/jobs?limit=-1',
      '/v1/career/jobs?limit=99999',
      '/v1/career/jobs?limit=abc',
      '/v1/career/jobs?cursor=-5',
      `/v1/career/jobs?q=${encodeURIComponent('x'.repeat(500))}`,
      '/v1/career/jobs/0',
      '/v1/career/jobs/abc',
      '/v1/career/jobs/-1',
      '/v1/career/majors/99999999999999999999',
    ];
    for (const u of urls) {
      const res = await api(ctx.baseUrl, user.accessToken, 'GET', u);
      if (res.status !== 200 && res.status !== 404) expectStandardError(res, [400]);
      expect(res.status).toBeLessThan(500);
    }
    // 인젝션 검색어 — 200(빈 결과) 또는 400, 500 금지
    for (const inj of INJECTIONS) {
      const res = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/jobs?q=${encodeURIComponent(inj)}`);
      expect(res.status, `injection: ${inj}`).toBeLessThan(500);
    }
  });

  it('AI 메시지 퍼징 — 빈/초과/타입오류/인젝션', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = s.json.data.id;
    const cases: unknown[] = [{}, { text: '' }, { text: '   ' }, { text: 'x'.repeat(3000) }, { text: 42 }, { text: null }, { wrong: 'field' }];
    for (const body of cases) {
      const res = await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/messages?stream=false`, body);
      expectStandardError(res, [400]);
    }
    for (const inj of INJECTIONS) {
      const res = await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/messages?stream=false`, { text: inj });
      expect([200, 400]).toContain(res.status); // 인젝션 문자는 일반 텍스트로 처리
    }
    // 존재하지 않는 세션
    const ghost = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions/no-such-session/messages?stream=false', { text: '안녕' });
    expectStandardError(ghost, [404]);
  });

  it('바디 크기 제한 — 100kb 초과 → 413 (프로세스 생존)', async () => {
    const huge = 'ㄱ'.repeat(200_000);
    const res = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/career/target', { career: huge });
    expect([400, 413]).toContain(res.status);
    expect(res.json.code).toBeTruthy();
    const health = await api(ctx.baseUrl, null, 'GET', '/health');
    expect(health.status).toBe(200);
  });

  it('진로 목표 — 최대 3개 초과 → 409 CONFLICT', async () => {
    const fresh = await signupStudent(ctx.baseUrl);
    for (let i = 0; i < 3; i++) {
      const res = await api(ctx.baseUrl, fresh.accessToken, 'POST', '/v1/career/target', { career: `목표 ${i}` });
      expect(res.status).toBe(201);
    }
    const fourth = await api(ctx.baseUrl, fresh.accessToken, 'POST', '/v1/career/target', { career: '네번째' });
    expect(fourth.status).toBe(409);
    expect(fourth.json.code).toBe('CONFLICT');
  });

  it('알 수 없는 라우트 → 404 표준 에러', async () => {
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/no/such/route');
    expectStandardError(res, [404]);
  });

  it('admin 전용 system/health — 학생 → 403', async () => {
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/admin/system/health');
    expectStandardError(res, [403]);
    expect(res.json.code).toBe('AUTH_FORBIDDEN');
  });
});
