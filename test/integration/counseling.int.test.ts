import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, bootTestApp, readSse, signupStudent, type TestContext, type TestUser } from '../helpers/test-app';

async function sendUserMessage(ctx: TestContext, user: TestUser, sessionId: string, text: string) {
  return api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sessionId}/messages?stream=false`, { text });
}

describe('AI 상담 — 세션/SSE 스트림/시그널/진행도 (계약 §2.4)', () => {
  let ctx: TestContext;
  let user: TestUser;

  beforeAll(async () => {
    ctx = await bootTestApp();
    user = await signupStudent(ctx.baseUrl);
  });
  afterAll(async () => {
    await ctx.close();
  });

  it('세션 생성 → active 조회 → 새 세션 생성 시 이전 종료', async () => {
    const s1 = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    expect(s1.status).toBe(201);
    const active = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/ai-counseling/sessions/active');
    expect(active.json.data.id).toBe(s1.json.data.id);

    const s2 = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const active2 = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/ai-counseling/sessions/active');
    expect(active2.json.data.id).toBe(s2.json.data.id);
  });

  it('SSE 스트리밍 — event: token* → done({messageId, signals, usage}) + heartbeat 주석', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const events = await readSse(`${ctx.baseUrl}/v1/ai-counseling/sessions/${s.json.data.id}/messages`, {
      method: 'POST',
      token: user.accessToken,
      body: { text: '동아리에서 영상 편집이 정말 재밌었어요' },
      stopOn: (ev) => ev.event === 'done' || ev.event === 'error',
    });
    const tokens = events.filter((e) => e.event === 'token');
    const done = events.find((e) => e.event === 'done');
    expect(tokens.length).toBeGreaterThan(5);
    expect(tokens[0]!.data).toHaveProperty('delta');
    expect(done).toBeTruthy();
    expect(done!.data.messageId).toBeTruthy();
    expect(done!.data.signals.length).toBeGreaterThan(0);
    expect(done!.data.signals[0]).toMatchObject({ tag: expect.stringMatching(/흥미|강점|가치|맥락/), sourceMessageId: expect.any(String) });
  });

  it('progress — evidence 기반 completeness 단조 증가', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = s.json.data.id;
    const p0 = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/ai-counseling/sessions/${sid}/progress`);
    expect(p0.json.data).toMatchObject({ evidenceCount: 0, completeness: 0, signals: [] });

    await sendUserMessage(ctx, user, sid, '영상 편집이 재밌어요');
    const p1 = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/ai-counseling/sessions/${sid}/progress`);
    expect(p1.json.data.evidenceCount).toBeGreaterThan(0);
    expect(p1.json.data.completeness).toBeGreaterThan(p0.json.data.completeness);
    expect(p1.json.data.completeness).toBeLessThanOrEqual(100);
  });

  it('transcript — 메시지+시그널 누적', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = s.json.data.id;
    await sendUserMessage(ctx, user, sid, '친구를 돕는 게 중요해요');
    const t = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/ai-counseling/sessions/${sid}/transcript`);
    expect(t.json.data.messages.length).toBe(2); // user + ai
    expect(t.json.data.messages[0]).toMatchObject({ role: 'user' });
    expect(t.json.data.messages[1]).toMatchObject({ role: 'ai' });
    expect(t.json.data.signals.length).toBeGreaterThan(0);
  });

  it('GET /stream — 완료된 메시지 토큰 재수신 (Last-Event-ID 재개)', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = s.json.data.id;
    const sent = await sendUserMessage(ctx, user, sid, '영상 만들 때 몰입해요');
    const messageId = sent.json.data.message.id;

    const replay = await readSse(`${ctx.baseUrl}/v1/ai-counseling/sessions/${sid}/stream?messageId=${messageId}`, {
      token: user.accessToken,
      stopOn: (ev) => ev.event === 'done' || ev.event === 'error',
    });
    const tokens = replay.filter((e) => e.event === 'token');
    expect(tokens.length).toBeGreaterThan(5);
    expect(replay.at(-1)!.event).toBe('done');

    // Last-Event-ID 중간 재개 — 앞 절반 이후만 수신
    const midId = tokens[Math.floor(tokens.length / 2)]!.id!;
    const resumed = await readSse(`${ctx.baseUrl}/v1/ai-counseling/sessions/${sid}/stream?messageId=${messageId}`, {
      token: user.accessToken,
      lastEventId: midId,
      stopOn: (ev) => ev.event === 'done' || ev.event === 'error',
    });
    const resumedTokens = resumed.filter((e) => e.event === 'token');
    expect(resumedTokens.length).toBeLessThan(tokens.length);
    expect(resumedTokens.length).toBeGreaterThan(0);
    expect(Number(resumedTokens[0]!.id)).toBeGreaterThan(Number(midId));
  });

  it('타인 세션 접근 → 404 (소유권)', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const other = await signupStudent(ctx.baseUrl);
    const res = await api(ctx.baseUrl, other.accessToken, 'GET', `/v1/ai-counseling/sessions/${s.json.data.id}/transcript`);
    expect(res.status).toBe(404);
    expect(res.json.code).toBe('AI_SESSION_NOT_FOUND');
  });

  it('리포트 — evidence 부족 시 409, 충분 시 202 + 멱등', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = s.json.data.id;
    const early = await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/report`);
    expect(early.status).toBe(409);
    expect(early.json.code).toBe('AI_NOT_ENOUGH_EVIDENCE');

    for (const text of ['영상 편집이 재밌어요', '친구들이 칭찬해줘요. 잘해요', '돕는 게 중요해요', '동아리에서 몰입했어요']) {
      await sendUserMessage(ctx, user, sid, text);
    }
    const r1 = await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/report`);
    expect(r1.status).toBe(202);
    const r2 = await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/report`);
    expect(r2.json.data.reportId).toBe(r1.json.data.reportId); // 멱등

    const rep = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/ai-counseling/reports/${r1.json.data.reportId}`);
    expect(rep.status).toBe(200);
    expect(rep.json.data.content.disclaimer).toContain('잠정 가설'); // 계약: 항상 disclaimer
    expect(rep.json.data.content.provisional).toBe(true);
  });

  it('AI 상담 rate limit 30/min → 31번째 429 표준 에러', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = s.json.data.id;
    let got429 = false;
    for (let i = 0; i < 31 && !got429; i++) {
      const res = await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/messages?stream=false`, { text: `메시지 ${i} 재밌어요` });
      if (res.status === 429) {
        got429 = true;
        expect(res.json.code).toBe('RATE_LIMITED');
        expect(res.json.error.traceId).toBeTruthy();
      }
    }
    expect(got429).toBe(true);
  }, 120_000);
});
