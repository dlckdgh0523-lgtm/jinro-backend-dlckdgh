import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { api, bootTestApp, readSse, signupStudent, type TestContext, type TestUser } from '../helpers/test-app';
import { NotificationsService } from '../../src/realtime/notifications.service';

describe('알림 — dedupeKey 멱등 + SSE + Last-Event-ID 재전송 (계약 §2.6)', () => {
  let ctx: TestContext;
  let user: TestUser;
  let notifications: NotificationsService;

  beforeAll(async () => {
    ctx = await bootTestApp();
    user = await signupStudent(ctx.baseUrl);
    notifications = ctx.app.get(NotificationsService);
  });
  afterAll(async () => {
    await ctx.close();
  });

  it('알림 생성 → 목록 {data, meta} + 필수 필드', async () => {
    await notifications.notify(user.user.id, {
      type: 'ai.report.ready',
      dedupeKey: `t1-${Date.now()}`,
      title: '리포트 준비',
      body: '확인해보세요',
      targetUrl: '/student/career/report',
      payload: { reportId: 'r1' },
    });
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/notifications');
    expect(res.status).toBe(200);
    const n = res.json.data[0];
    // 계약 §8 필수 필드: id, type, dedupeKey, title, body, createdAt, targetUrl, payload
    expect(n).toMatchObject({
      id: expect.any(String),
      type: 'ai.report.ready',
      dedupeKey: expect.any(String),
      title: expect.any(String),
      body: expect.any(String),
      createdAt: expect.any(String),
      targetUrl: expect.any(String),
      read: false,
    });
  });

  it('같은 dedupeKey 재발생 → 중복 알림 없음 (토스트 폭격 방지)', async () => {
    const key = `dup-${Date.now()}`;
    const input = { type: 'mock-exam.reminder', dedupeKey: key, title: 'a', body: 'b' };
    await notifications.notify(user.user.id, input);
    await notifications.notify(user.user.id, input);
    await notifications.notify(user.user.id, input);
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/notifications?limit=100');
    expect(res.json.data.filter((n: { dedupeKey: string }) => n.dedupeKey === key)).toHaveLength(1);
  });

  it('read / read-all', async () => {
    const list = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/notifications?unreadOnly=true&limit=100');
    expect(list.json.data.length).toBeGreaterThan(0);
    const first = list.json.data[0];
    await api(ctx.baseUrl, user.accessToken, 'PATCH', `/v1/notifications/${first.id}/read`);
    const after = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/notifications?unreadOnly=true&limit=100');
    expect(after.json.data.find((n: { id: string }) => n.id === first.id)).toBeUndefined();
    const all = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/notifications/read-all');
    expect(all.json.data.ok).toBe(true);
    const empty = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/notifications?unreadOnly=true');
    expect(empty.json.data).toHaveLength(0);
  });

  it('SSE 실시간 수신 — EventSource(쿼리 토큰) + 이벤트 필드', async () => {
    const ssePromise = readSse(`${ctx.baseUrl}/v1/notifications/sse?access_token=${user.accessToken}`, {
      maxEvents: 1,
      timeoutMs: 10_000,
    });
    await new Promise((r) => setTimeout(r, 400)); // 구독 안정화
    await notifications.notify(user.user.id, {
      type: 'student.joined',
      dedupeKey: `sse-${Date.now()}`,
      title: '새 학생',
      body: '합류했어요',
    });
    const events = await ssePromise;
    expect(events).toHaveLength(1);
    expect(events[0]!.event).toBe('student.joined');
    expect(events[0]!.id).toMatch(/^\d+$/);
    expect(events[0]!.data).toMatchObject({ type: 'student.joined', dedupeKey: expect.any(String) });
  });

  it('SSE 끊김 후 재연결 — Last-Event-ID로 누락분 수신 (계약 §8 핵심)', async () => {
    // 1차 연결로 이벤트 1개 수신
    const first = readSse(`${ctx.baseUrl}/v1/notifications/sse?access_token=${user.accessToken}`, { maxEvents: 1, timeoutMs: 10_000 });
    await new Promise((r) => setTimeout(r, 400));
    await notifications.notify(user.user.id, { type: 'message.received', dedupeKey: `r1-${Date.now()}`, title: '1', body: '1' });
    const got = await first;
    const lastId = got[0]!.id!;

    // 연결이 끊긴 사이 이벤트 2개 발생
    await notifications.notify(user.user.id, { type: 'message.received', dedupeKey: `r2-${Date.now()}`, title: '2', body: '2' });
    await notifications.notify(user.user.id, { type: 'message.received', dedupeKey: `r3-${Date.now()}`, title: '3', body: '3' });

    // Last-Event-ID 재연결 → 누락 2건 즉시 재전송
    const resumed = await readSse(`${ctx.baseUrl}/v1/notifications/sse?access_token=${user.accessToken}`, {
      lastEventId: lastId,
      maxEvents: 2,
      timeoutMs: 10_000,
    });
    expect(resumed).toHaveLength(2);
    expect(resumed.map((e) => e.data.title)).toEqual(['2', '3']);
    expect(Number(resumed[0]!.id)).toBeGreaterThan(Number(lastId));
  });

  it('동시 다발 SSE 연결 30개 — 전원 수신 (팬아웃)', async () => {
    const conns = Array.from({ length: 30 }, () =>
      readSse(`${ctx.baseUrl}/v1/notifications/sse?access_token=${user.accessToken}`, { maxEvents: 1, timeoutMs: 15_000 }),
    );
    await new Promise((r) => setTimeout(r, 800));
    await notifications.notify(user.user.id, { type: 'invite.used', dedupeKey: `fan-${Date.now()}`, title: 'fan', body: 'out' });
    const all = await Promise.all(conns);
    expect(all.every((events) => events.length === 1 && events[0]!.data.title === 'fan')).toBe(true);
  });
});
