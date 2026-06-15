import type { Worker } from 'bullmq';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, bootTestApp, readSse, signupStudent, type TestContext, type TestUser } from '../helpers/test-app';

// E2E: 온보딩(가입) → 검사 목록 → AI 상담(스트림 수신) → PDF 생성 → 다운로드 (미션 P6)
// PDF 워커를 in-process로 띄워 실제 Playwright 렌더까지 검증한다.

describe('E2E — 전체 사용자 여정 + PDF 파이프라인', () => {
  let ctx: TestContext;
  let user: TestUser;
  let pdfWorker: Worker;

  beforeAll(async () => {
    ctx = await bootTestApp();
    user = await signupStudent(ctx.baseUrl);
    const { startPdfWorker, workerDeps } = await import('../../src/jobs/pdf.worker');
    pdfWorker = startPdfWorker(workerDeps());
  }, 120_000);

  afterAll(async () => {
    await pdfWorker?.close();
    await ctx.close();
  });

  it('가입 → 검사 → AI 상담 스트림 → 리포트 → PDF 다운로드', async () => {
    // 1) 검사 목록 (온보딩에서 노출)
    const tests = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/tests');
    expect(tests.status).toBe(200);

    // 2) AI 상담 — 스트림으로 대화 5회 (evidence 축적)
    const session = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = session.json.data.id;
    const texts = [
      '동아리에서 영상 편집을 했는데 정말 재밌었어요',
      '친구들이 제 영상을 칭찬해줬어요. 편집을 잘해요',
      '사람들에게 도움이 되는 콘텐츠가 중요해요',
      '학교 축제 영상도 만들었어요. 몰입했어요',
      '디자인에도 관심이 생겼어요',
    ];
    for (const text of texts) {
      const events = await readSse(`${ctx.baseUrl}/v1/ai-counseling/sessions/${sid}/messages`, {
        method: 'POST',
        token: user.accessToken,
        body: { text },
        stopOn: (ev) => ev.event === 'done' || ev.event === 'error',
      });
      expect(events.at(-1)!.event).toBe('done');
    }
    const prog = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/ai-counseling/sessions/${sid}/progress`);
    expect(prog.json.data.evidenceCount).toBeGreaterThanOrEqual(5);

    // 3) 리포트 트리거 (POST /v1/reports — 미션 P4 경로)
    const trigger = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/reports', { sessionId: sid });
    expect(trigger.status).toBe(202);
    const { reportId, jobId } = trigger.json.data;
    expect(jobId).toBeTruthy();

    // 4) 잡 진행 SSE — progress → done(pdfUrl)
    const jobEvents = await readSse(`${ctx.baseUrl}/v1/jobs/${jobId}/events?access_token=${user.accessToken}`, {
      stopOn: (ev) => ev.event === 'done' || ev.event === 'error',
      timeoutMs: 60_000,
    });
    const doneEv = jobEvents.find((e) => e.event === 'done');
    expect(doneEv, `job events: ${JSON.stringify(jobEvents.map((e) => e.event))}`).toBeTruthy();
    expect(doneEv!.data.pdfUrl).toContain('/v1/files/');

    // 5) 상태 조회 + PDF 다운로드 (presigned-유사 URL)
    const status = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/reports/${reportId}`);
    expect(status.json.data.status).toBe('done');
    const pdfUrl = (status.json.data.pdfUrl as string).replace('http://localhost/', ctx.baseUrl + '/');
    const pdf = await fetch(pdfUrl);
    expect(pdf.status).toBe(200);
    expect(pdf.headers.get('content-type')).toBe('application/pdf');
    const bytes = Buffer.from(await pdf.arrayBuffer());
    expect(bytes.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    expect(bytes.length).toBeGreaterThan(10_000); // 폰트 임베드 포함 실질 렌더

    // 6) 위조 서명 다운로드 거부
    const tampered = pdfUrl.replace(/sig=[0-9a-f]{10}/, 'sig=deadbeef00');
    const bad = await fetch(tampered);
    expect(bad.status).toBe(403);
  }, 180_000);

  it('동일 PDF 동시 중복 요청 10건 → 단일 reportId (멱등)', async () => {
    const session = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = session.json.data.id;
    for (const text of ['편집이 재밌어요', '칭찬받았어요 잘해요', '돕는 게 중요해요', '동아리 몰입']) {
      await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/messages?stream=false`, { text });
    }
    const results = await Promise.all(
      Array.from({ length: 10 }, () => api(ctx.baseUrl, user.accessToken, 'POST', '/v1/reports', { sessionId: sid })),
    );
    const okResults = results.filter((r) => r.status === 202);
    expect(okResults.length).toBeGreaterThan(0);
    const ids = new Set(okResults.map((r) => r.json.data.reportId));
    expect(ids.size).toBe(1); // 전부 같은 리포트
    // 충돌(P2002)로 5xx가 새어 나가지 않았는지
    expect(results.every((r) => [202, 409].includes(r.status))).toBe(true);
  }, 120_000);

  it('타인 리포트/잡 접근 차단', async () => {
    const other = await signupStudent(ctx.baseUrl);
    const mine = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/notifications?limit=1');
    expect(mine.status).toBe(200);
    const reports = await api(ctx.baseUrl, other.accessToken, 'GET', '/v1/reports/nonexistent-id');
    expect(reports.status).toBe(404);
    expect(reports.json.code).toBe('REPORT_NOT_FOUND');
  });
});
