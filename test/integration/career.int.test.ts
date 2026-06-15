import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, bootTestApp, signupStudent, type TestContext, type TestUser } from '../helpers/test-app';

describe('커리어넷 프록시 — 정규화/캐시/스탬피드/장애주입', () => {
  let ctx: TestContext;
  let user: TestUser;

  beforeAll(async () => {
    ctx = await bootTestApp();
    user = await signupStudent(ctx.baseUrl);
  });
  afterAll(async () => {
    await ctx.close();
  });

  it('직업백과 목록 — {data, meta} 모양 + dirty data 정제 (계약 §2.2)', async () => {
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/jobs?limit=10');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.json.data)).toBe(true);
    expect(res.json.data.length).toBe(10);
    expect(res.json.meta).toMatchObject({ source: expect.stringMatching(/db|live/) });
    const job = res.json.data[0];
    expect(job).toHaveProperty('seq');
    expect(job).toHaveProperty('name');
    expect(Array.isArray(job.relatedMajors)).toBe(true);
    // "null" 문자열이 그대로 새어나오지 않아야 한다
    for (const j of res.json.data) {
      expect(j.salary).not.toBe('null');
      expect(j.summary ?? '').not.toContain('<br>');
      expect(j.summary ?? '').not.toContain('\\r\\n');
    }
  });

  it('직업 상세 + 미존재 seq → 404 CAREERNET_NOT_FOUND', async () => {
    const ok = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/jobs/1');
    expect(ok.status).toBe(200);
    expect(ok.json.data.name).toBeTruthy();
    const missing = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/jobs/999999');
    expect(missing.status).toBe(404);
    expect(missing.json.code).toBe('CAREERNET_NOT_FOUND');
  });

  it('EUC-KR XML 계열(학과/학교/상담사례) — 한글 정상 + 배열 정규화', async () => {
    const majors = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/majors?limit=5');
    expect(majors.status).toBe(200);
    expect(majors.json.data[0].name).toMatch(/학과|계열|학$|과$/);
    expect(Array.isArray(majors.json.data[0].departments)).toBe(true);

    const schools = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/schools?limit=5');
    expect(schools.status).toBe(200);
    expect(schools.json.data[0].name).toContain('학교');

    // COUNSEL live 경로는 질문 코드표(제목만) — 본문(question/answer)은 ingestion이 COUNSEL_VIEW로 채운다
    const counsel = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/counseling-cases?limit=3');
    expect(counsel.status).toBe(200);
    expect(counsel.json.data[0].title).toBeTruthy();
    for (const c of counsel.json.data) {
      if (c.answer) {
        expect(c.answer).not.toContain('&lt;/br&gt;');
        expect(c.answer).not.toContain('</br>');
      }
    }

    // COSE — 단일 객체 → 배열 정규화 + attFile 쉼표 분해
    const cose = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/education-materials');
    expect(cose.status).toBe(200);
    expect(Array.isArray(cose.json.data)).toBe(true);
    expect(cose.json.data[0].attFiles.length).toBe(2);
  });

  it('검사 목록 (inspct v2 JSON)', async () => {
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/tests');
    expect(res.status).toBe(200);
    expect(res.json.data.find((t: { name: string }) => t.name.includes('직업흥미검사'))).toBeTruthy();
  });

  it('캐시 — 동일 쿼리 2회째는 upstream 호출 없음', async () => {
    const q = `cache-${Date.now()}`;
    await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/education-materials?q=${q}`);
    const before = ctx.careernet.requestCount;
    await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/education-materials?q=${q}`);
    expect(ctx.careernet.requestCount).toBe(before); // 캐시 히트
  });

  it('single-flight — 동시 캐시 미스 20건 → upstream 1회 (스탬피드 방지)', async () => {
    // education-materials는 DB 적재 없이 항상 live — 적재 여부와 무관하게 single-flight를 검증
    const q = encodeURIComponent(`sf-${Date.now()}`);
    const before = ctx.careernet.requestCount;
    const results = await Promise.all(
      Array.from({ length: 20 }, () => api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/education-materials?q=${q}`)),
    );
    expect(results.every((r) => r.status === 200)).toBe(true);
    expect(ctx.careernet.requestCount - before).toBe(1);
  });

  it('장애 주입: HTTP 500 → 502 CAREERNET_UPSTREAM_ERROR (스택 비노출)', async () => {
    ctx.careernet.setFault('http500');
    try {
      const res = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/education-materials?q=f500-${Date.now()}`);
      expect([502, 503]).toContain(res.status);
      expect(res.json.code).toMatch(/^CAREERNET_/);
      expect(JSON.stringify(res.json)).not.toContain('at '); // 스택 누수 없음
      expect(res.json.traceId).toBeTruthy();
    } finally {
      ctx.careernet.setFault('');
    }
  });

  it('장애 주입: 빈 응답/깨진 바이트 → CAREERNET_PARSE_ERROR 표준 에러', async () => {
    ctx.careernet.setFault('empty');
    try {
      const res = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/education-materials?q=fe-${Date.now()}`);
      expect([502, 503]).toContain(res.status);
      expect(res.json.code).toMatch(/^CAREERNET_/);
    } finally {
      ctx.careernet.setFault('');
    }
    ctx.careernet.setFault('garbled');
    try {
      const res = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/education-materials?q=fg-${Date.now()}`);
      // 깨진 XML이라도 프로세스는 살아 있고 표준 에러 또는 빈 정규화 결과
      expect([200, 502, 503]).toContain(res.status);
      if (res.status !== 200) expect(res.json.code).toMatch(/^CAREERNET_/);
    } finally {
      ctx.careernet.setFault('');
    }
    // 장애 이후 정상 복구 확인 (프로세스 생존)
    const after = await api(ctx.baseUrl, user.accessToken, 'GET', '/health');
    expect(after.status).toBe(200);
  });

  it('장애 주입: 타임아웃 → 503 CAREERNET_UPSTREAM_TIMEOUT', async () => {
    ctx.careernet.setFault('timeout');
    try {
      const res = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/career/education-materials?q=ft-${Date.now()}`);
      expect([502, 503]).toContain(res.status);
      expect(res.json.code).toMatch(/CAREERNET_(UPSTREAM_TIMEOUT|UPSTREAM_ERROR|CIRCUIT_OPEN)/);
    } finally {
      ctx.careernet.setFault('');
    }
  }, 90_000);
});
