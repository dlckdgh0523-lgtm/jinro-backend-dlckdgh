import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { api, bootTestApp, signupStudent, type TestContext, type TestUser } from '../helpers/test-app';

// 계약 테스트 — FRONTEND_CONTRACT.md의 응답 모양을 zod로 고정.
// 프론트 fetch 클라이언트(app-runtime.jsx)가 읽는 필드가 깨지면 여기서 실패한다.

const userShape = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['student', 'teacher', 'admin']),
  tourCompleted: z.boolean(),
  status: z.string(),
  createdAt: z.string(),
});

const authShape = z.object({ accessToken: z.string(), refreshToken: z.string(), user: userShape });

// 에러 병합 형태 (DECISIONS #7): 최상위 code/message/traceId + 중첩 error
const errorShape = z
  .object({
    code: z.string(),
    message: z.string(),
    traceId: z.string(),
    error: z.object({ code: z.string(), message: z.string(), traceId: z.string() }),
  })
  .refine((b) => b.code === b.error.code, 'code mismatch');

const listMetaShape = z.object({ source: z.enum(['db', 'live']), updatedAt: z.string().nullable() }).passthrough();

const jobShape = z.object({
  seq: z.number(),
  name: z.string(),
  summary: z.string().nullable(),
  aptitude: z.string().nullable(),
  salary: z.string().nullable(),
  prospect: z.string().nullable(),
  relatedMajors: z.array(z.string()),
  theme: z.string().nullable(),
});

const signalShape = z.object({
  tag: z.enum(['흥미', '강점', '가치', '맥락']),
  text: z.string(),
  sourceMessageId: z.string().nullable(),
  confidence: z.string(),
});

const notificationShape = z.object({
  id: z.string(),
  type: z.string(),
  dedupeKey: z.string(),
  title: z.string(),
  body: z.string(),
  createdAt: z.string(),
  targetUrl: z.string().nullable(),
  payload: z.unknown(),
  read: z.boolean(),
});

const universityShape = z.object({
  id: z.string(),
  name: z.string(),
  short: z.string(),
  region: z.string().nullable(),
  type: z.enum(['national', 'private', 'municipal', 'special']),
  deptCount: z.number().nullable(),
  confidence: z.enum(['confirmed', 'estimated', 'unavailable']),
});

describe('계약 — FRONTEND_CONTRACT.md 응답 모양 고정', () => {
  let ctx: TestContext;
  let user: TestUser;

  beforeAll(async () => {
    // 대학알리미 보강 포함 (mock 서버에 alimi 라우트 공존 — helpers가 ALIMI_BASE_URL을 mock으로 연결)
    ctx = await bootTestApp({ DATA_GO_KR_API_KEY: 'test-alimi-key' });
    user = await signupStudent(ctx.baseUrl);
    // admissions 데이터 준비 — ingestion 1회
    const { startIngestWorker } = await import('../../src/jobs/ingest.worker');
    const { workerDeps } = await import('../../src/jobs/pdf.worker');
    const { getQueues } = await import('../../src/jobs/queues');
    const deps = workerDeps();
    const w = startIngestWorker(deps.prisma);
    await getQueues().ingest.add('full', {});
    // 적재 완료 대기 — alimi 보강(마지막 소스)까지
    for (let i = 0; i < 120; i++) {
      await new Promise((r) => setTimeout(r, 500));
      const alimiDone = await deps.prisma.ingestionRun.findFirst({ where: { source: 'alimi', status: 'done' } });
      if (alimiDone && (await deps.prisma.careerJob.count()) > 0) break;
    }
    // 대학별 학과 시드 — CSV importer 파서로 샘플 행 적재 (실 CSV 파일 의존 없이 엔드포인트 계약 검증)
    const { parseCsvLine, parseDeptRow } = await import('../../src/admissions/dept-csv');
    const sampleSchool = await deps.prisma.school.findFirst();
    if (sampleSchool) {
      const lines = [
        `2021,대학,대학,서울,사립,${sampleSchool.name},본교,공과대학,컴퓨터공학과,주간,일반과정,기존,공학계열,컴퓨터,컴퓨터공학,공학계열,4년,학사`,
        `2021,대학,대학,서울,사립,${sampleSchool.name},본교,인문대학,국어국문학과,주간,일반과정,신설,인문계열,언어,국어국문,인문계열,4년,학사`,
        `2021,대학,대학,서울,사립,${sampleSchool.name},본교,예술대학,폐지학과,주간,일반과정,폐지,예체능계열,미술,미술,예체능계열,4년,학사`,
      ];
      for (const line of lines) {
        const r = parseDeptRow(parseCsvLine(line))!;
        await deps.prisma.universityDepartment.upsert({
          where: { schoolName_campus_name_svyYr: { schoolName: r.schoolName, campus: r.campus ?? '', name: r.name, svyYr: r.svyYr } },
          create: { ...r, campus: r.campus ?? '', schoolSeq: sampleSchool.seq },
          update: {},
        });
      }
    }
    await w.close();
  }, 120_000);

  afterAll(async () => {
    await ctx.close();
  });

  it('§1 인증 — {accessToken, refreshToken, user}', async () => {
    const res = await api(ctx.baseUrl, null, 'POST', '/v1/auth/signup/student', {
      email: `contract-${Date.now()}@test.kr`,
      password: 'password123!',
      name: '계약',
      consents: { tos: true, privacy: true, academic: true, ai: true, age: true },
    });
    expect(() => authShape.parse(res.json)).not.toThrow();
    const login = await api(ctx.baseUrl, null, 'POST', '/v1/auth/login', { email: res.json.user.email, password: 'password123!' });
    expect(() => authShape.extend({ nextPath: z.string() }).parse(login.json)).not.toThrow();
  });

  it('에러 병합 형태 — 프론트 body.code/body.message 경로(app-runtime.jsx:147)', async () => {
    const res = await api(ctx.baseUrl, null, 'GET', '/v1/auth/me');
    expect(() => errorShape.parse(res.json)).not.toThrow();
  });

  it('§2.2 커리어넷 — {data: Job[], meta:{source, updatedAt}}', async () => {
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/career/jobs?limit=5');
    expect(() => z.object({ data: z.array(jobShape), meta: listMetaShape }).parse(res.json)).not.toThrow();
  });

  it('§2.4 상담 — progress/{evidenceCount, completeness, signals[]}', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${s.json.data.id}/messages?stream=false`, {
      text: '영상 편집이 재밌어요',
    });
    const prog = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/ai-counseling/sessions/${s.json.data.id}/progress`);
    const progShape = z.object({
      data: z.object({ evidenceCount: z.number(), completeness: z.number().min(0).max(100), signals: z.array(signalShape.extend({ id: z.string() })) }),
    });
    expect(() => progShape.parse(prog.json)).not.toThrow();
  });

  it('§2.4 리포트 content — headline/summary/careers/majors/disclaimer (extras-v4.jsx 모양)', async () => {
    const s = await api(ctx.baseUrl, user.accessToken, 'POST', '/v1/ai-counseling/sessions');
    const sid = s.json.data.id;
    for (const t of ['편집 재밌어요', '칭찬받아요 잘해요', '돕는 게 중요해요', '동아리 몰입']) {
      await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/messages?stream=false`, { text: t });
    }
    const trig = await api(ctx.baseUrl, user.accessToken, 'POST', `/v1/ai-counseling/sessions/${sid}/report`);
    const rep = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/ai-counseling/reports/${trig.json.data.reportId}`);
    const contentShape = z.object({
      student: z.string(),
      generated: z.string(),
      turns: z.number(),
      headline: z.string(),
      summary: z.string(),
      careers: z.array(z.object({ title: z.string(), score: z.number(), why: z.string() })),
      majors: z.array(z.string()),
      signals: z.array(z.object({ tag: z.string(), text: z.string() })),
      strengths: z.array(z.string()),
      risks: z.array(z.string()),
      nextActions: z.array(z.string()),
      disclaimer: z.string(),
      provisional: z.literal(true),
    });
    expect(() => contentShape.parse(rep.json.data.content)).not.toThrow();
  });

  it('§2.6 알림 — 필수 필드 {id,type,dedupeKey,title,body,createdAt,targetUrl,payload}', async () => {
    const { NotificationsService } = await import('../../src/realtime/notifications.service');
    await ctx.app.get(NotificationsService).notify(user.user.id, {
      type: 'admissions.updated',
      dedupeKey: `c-${Date.now()}`,
      title: '입시 업데이트',
      body: '확인하세요',
      targetUrl: '/x',
    });
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/notifications?limit=1');
    expect(() => z.object({ data: z.array(notificationShape), meta: z.object({ nextCursor: z.string().nullable() }) }).parse(res.json)).not.toThrow();
  });

  it('§2.3 입시 — University 모양 + confidence enum + unavailable 규칙', async () => {
    const res = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/admissions/universities?limit=5');
    expect(res.json.data.length).toBeGreaterThan(0);
    expect(() => z.array(universityShape).parse(res.json.data)).not.toThrow();

    const one = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/admissions/universities/${res.json.data[0].id}`);
    // 미보유 수치는 unavailable + null — 프론트는 숫자를 그리지 않는다 (계약 §5)
    expect(one.json.data.admissions).toMatchObject({ confidence: 'unavailable', recruit: null, ratio: null, cut70: null, avg: null });
    expect(one.json.data.source).toBeTruthy();
    expect(one.json.data.updatedAt).toBeTruthy();
  });

  it('§2.3 대학별 학과 — {data, meta:{svyYr, source, confidence}}, 폐지 제외/포함', async () => {
    const list = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/admissions/universities?limit=50');
    // 시드된 대학(학과 보유) 찾기
    let withDepts: { id: string } | null = null;
    let body: any = null;
    for (const u of list.json.data) {
      const r = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/admissions/universities/${u.id}/departments`);
      if (r.json.data.length > 0) {
        withDepts = u;
        body = r.json;
        break;
      }
    }
    expect(withDepts, '시드된 학과를 가진 대학이 있어야 함').toBeTruthy();
    // 프론트(admissions.jsx:42) 학과 카드 계약: name, college, track(한글), recruit, conf
    const deptShape = z.object({
      id: z.string(),
      name: z.string(),
      college: z.string().nullable(),
      track: z.enum(['인문', '자연', '예체능']).nullable(),
      recruit: z.null(),
      conf: z.literal('confirmed'),
      degree: z.string().nullable(),
      status: z.string(),
      active: z.boolean(),
    });
    expect(() => z.array(deptShape.passthrough()).parse(body.data)).not.toThrow();
    expect(body.meta).toMatchObject({ svyYr: 2021, source: expect.stringContaining('대학알리미'), confidence: 'confirmed' });
    expect(body.meta.note).toContain('2021');
    // 기본은 폐지 학과 제외
    expect(body.data.every((d: { active: boolean }) => d.active)).toBe(true);
    // includeInactive=true면 폐지 포함
    const withInactive = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/admissions/universities/${withDepts!.id}/departments?includeInactive=true`);
    expect(withInactive.json.data.length).toBeGreaterThanOrEqual(body.data.length);
  });

  it('§2.3 대학알리미 보강 — publicInfo(schlId, 설립, confidence:confirmed)', async () => {
    // alimi ingestion이 이름 매칭으로 보강한 대학을 찾는다 (mock: 본교 항목)
    const list = await api(ctx.baseUrl, user.accessToken, 'GET', '/v1/admissions/universities?q=서울대&limit=5');
    expect(list.json.data.length).toBeGreaterThan(0);
    const one = await api(ctx.baseUrl, user.accessToken, 'GET', `/v1/admissions/universities/${list.json.data[0].id}`);
    expect(one.json.data.publicInfo).toMatchObject({
      schlId: expect.any(String),
      estType: expect.any(String),
      source: expect.stringContaining('대학알리미'),
      confidence: 'confirmed',
    });
  });

  it('§2.7 헬스 — /health, /ready', async () => {
    const h = await api(ctx.baseUrl, null, 'GET', '/health');
    expect(() => z.object({ status: z.literal('ok'), uptimeSec: z.number() }).parse(h.json)).not.toThrow();
    const r = await api(ctx.baseUrl, null, 'GET', '/ready');
    expect(() => z.object({ status: z.literal('ready'), checks: z.object({ db: z.literal('ok'), redis: z.literal('ok') }) }).parse(r.json)).not.toThrow();
  });
});
