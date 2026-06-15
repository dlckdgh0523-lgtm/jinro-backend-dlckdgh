import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import { aiClient, SYSTEM_PROMPT } from './ai-client';
import { extractSignals } from './signals';
import { Retriever } from './retriever';
import { PrismaService } from '../db/prisma.service';
import { PubSubService } from '../realtime/pubsub.service';
import { AppError, ErrorCode } from '../common/errors';
import { env } from '../common/env';
import { logger } from '../common/logger';
import { getQueues } from '../jobs/queues';

// AI 진로상담 오케스트레이션 — 세션/메시지/시그널/진행도/리포트.
// completeness는 고정 step이 아니라 evidence(시그널) 기반 (FRONTEND_CONTRACT §2.4).

const REPORT_MIN_EVIDENCE = 5;

/** ```json 코드펜스 제거 (모델이 종종 감싸서 반환) */
function stripFence(text: string): string {
  return text.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
}

/** 모델 출력에서 JSON 객체를 견고하게 추출 — 코드펜스/앞뒤 잡설/잘림 방어 */
function parseReportJson(text: string): Record<string, unknown> | null {
  const cleaned = stripFence(text);
  const start = cleaned.indexOf('{');
  if (start < 0) return null;
  // 첫 '{'부터 괄호 균형을 맞춰 끝을 찾는다 (마지막 '}' 단순 절단보다 견고)
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < cleaned.length; i++) {
    const c = cleaned[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') inStr = false;
    } else if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(cleaned.slice(start, i + 1)) as Record<string, unknown>;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

/** 모델이 응답에 누수한 단계 안내/내부 태그 제거 (이중 안전망) */
export function stripLeakedState(text: string): string {
  return text
    .replace(/<state>[\s\S]*?<\/state>/gi, '')
    .replace(/<state>[\s\S]*$/i, '') // 닫는 태그 없이 잘린 경우
    .replace(/\[상담 단계 안내[\s\S]*$/i, '')
    .replace(/\[학생 학년 안내[\s\S]*$/i, '')
    .trimEnd();
}

/** 학년 코드(E4~H3) → 커리어넷 COSE target 코드 (C/E/M/I/J) */
export function gradeToTarget(grade: string): string {
  if (/^E/.test(grade)) return 'E';
  if (/^M/.test(grade)) return 'M';
  if (/^H/.test(grade)) return 'I'; // 일반고 우선 (직업고는 별도 입력 필요)
  return 'C';
}

/** 학년 코드 → 한국어 라벨 */
export function gradeKoreanLabel(grade: string): string {
  const map: Record<string, string> = { E4: '초4', E5: '초5', E6: '초6', M1: '중1', M2: '중2', M3: '중3', H1: '고1', H2: '고2', H3: '고3' };
  return map[grade] ?? grade;
}

/** 단위테스트 전용 export */
export const __test = { parseReportJson, stripFence, stripLeakedState, gradeToTarget, gradeKoreanLabel };

// 교사 코칭 모드 — AI가 '학생을 상담하는 척'하지 않고, 교사의 상담 설계를 돕는 코치 역할.
const TEACHER_COACH_PROMPT = [
  '당신은 진로나침반의 교사 상담 코치입니다. 상대는 학생이 아니라 진로·진학 지도를 하는 선생님입니다.',
  '목표: 선생님이 학생을 어떻게 상담·지도할지 실질적으로 돕는 것. 다음을 제공하세요 —',
  '1) 학생에게 던질 좋은 질문/대화 흐름 제안(탐색→파악→추천→준비 단계 활용),',
  '2) 제공된 [참고 데이터](학과·직업·대학·봉사·장학금 공공데이터)를 근거로 한 구체적 정보,',
  '3) 다음 상담에서 확인할 점·연결할 자료.',
  '원칙: 구체적 사실(학과/경쟁률/취업률/장학금 등)은 반드시 제공된 참고 데이터에 근거해서만 말하고, 없으면 "데이터 없음"이라고 솔직히 밝히세요. 추측 금지.',
  '학생을 진단(정신건강 등)하지 말고, 학업·진로 지도 관점으로만 조언하세요. 한국어로, 실무적으로 간결하게 답하세요.',
].join('\n');

export interface StreamCallbacks {
  onToken(text: string): void;
  onDone(payload: { messageId: string; signals: unknown[]; usage: unknown; completeness: number }): void;
}

@Injectable()
export class CounselingService {
  // AI 동시 스트림 상한 (인스턴스당) — 승인된 캡슐화 카운터
  private activeStreams = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly retriever: Retriever,
    private readonly pubsub: PubSubService,
  ) {}

  async createSession(userId: string) {
    // 한 사용자당 active 세션 1개 — 새로 만들면 이전 것은 종료
    await this.prisma.counselingSession.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'ended', endedAt: new Date() },
    });
    const session = await this.prisma.counselingSession.create({ data: { userId } });
    return { data: this.sessionDto(session) };
  }

  async activeSession(userId: string) {
    const session = await this.prisma.counselingSession.findFirst({
      where: { userId, status: 'active' },
      orderBy: { startedAt: 'desc' },
    });
    return { data: session ? this.sessionDto(session) : null };
  }

  private async getOwnedSession(userId: string, sessionId: string) {
    const session = await this.prisma.counselingSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) {
      throw new AppError(ErrorCode.AI_SESSION_NOT_FOUND, '상담 세션을 찾을 수 없어요.');
    }
    return session;
  }

  async transcript(userId: string, sessionId: string) {
    await this.getOwnedSession(userId, sessionId);
    const [messages, signals] = await Promise.all([
      this.prisma.counselingMessage.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } }),
      this.prisma.counselingSignal.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } }),
    ]);
    return {
      data: {
        messages: messages.map((m) => ({ id: m.id, role: m.role, text: m.text, createdAt: m.createdAt.toISOString() })),
        signals: signals.map((s) => this.signalDto(s)),
      },
    };
  }

  async progress(userId: string, sessionId: string) {
    await this.getOwnedSession(userId, sessionId);
    return { data: await this.progressOf(sessionId) };
  }

  /**
   * 상담 단계 — prompt.md의 4단계와 일치. evidence(단서) 기반으로 안정적으로 진행.
   * explore(탐색) → profile(파악) → recommend(추천)/prepare(준비). 고정 step이 아니라 단서 누적이 기준.
   */
  private async stageOf(sessionId: string): Promise<{ stage: 'explore' | 'profile' | 'recommend' | 'prepare'; signals: { tag: string; text: string }[]; userTurns: number }> {
    const [signals, userTurns, hasTarget] = await Promise.all([
      this.prisma.counselingSignal.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } }),
      this.prisma.counselingMessage.count({ where: { sessionId, role: 'user' } }),
      this.prisma.counselingSession.findUnique({ where: { id: sessionId } }).then((s) => (s ? this.prisma.careerTarget.count({ where: { userId: s.userId } }) : 0)),
    ]);
    const distinctTags = new Set(signals.map((s) => s.tag)).size;
    let stage: 'explore' | 'profile' | 'recommend' | 'prepare';
    if (signals.length < 3 || distinctTags < 2) stage = 'explore';
    else if (signals.length < 6) stage = 'profile';
    else stage = hasTarget > 0 ? 'prepare' : 'recommend';
    return { stage, signals: signals.map((s) => ({ tag: s.tag, text: s.text })), userTurns };
  }

  private async progressOf(sessionId: string) {
    const [signals, userMsgCount, stageInfo] = await Promise.all([
      this.prisma.counselingSignal.findMany({ where: { sessionId } }),
      this.prisma.counselingMessage.count({ where: { sessionId, role: 'user' } }),
      this.stageOf(sessionId),
    ]);
    // evidence 기반 completeness — 시그널이 주, 대화 횟수는 보조 (고정 step 금지)
    const completeness = Math.min(100, signals.length * 12 + Math.min(userMsgCount, 8) * 4);
    return {
      evidenceCount: signals.length,
      completeness,
      stage: stageInfo.stage, // 프론트가 단계 UI(탐색/파악/추천/준비)를 그릴 수 있게 노출
      signals: signals.map((s) => this.signalDto(s)),
    };
  }

  /**
   * 메시지 전송 + AI 응답 스트리밍.
   * 호출자(컨트롤러)가 SSE로 토큰을 흘리고, abort signal로 disconnect 시 중단을 전달한다.
   * 동시에 Redis에 토큰 버퍼를 적재해 GET /stream 재수신(EventSource 대안)을 지원한다.
   */
  async sendMessage(
    userId: string,
    sessionId: string,
    text: string,
    signal: AbortSignal,
    callbacks: StreamCallbacks,
  ): Promise<void> {
    const session = await this.getOwnedSession(userId, sessionId);
    if (session.status !== 'active') {
      throw new AppError(ErrorCode.AI_SESSION_NOT_FOUND, '이미 종료된 상담이에요. 새 상담을 시작해주세요.');
    }
    if (this.activeStreams >= env().AI_MAX_CONCURRENT_STREAMS) {
      throw new AppError(ErrorCode.AI_TOO_MANY_STREAMS, '동시 상담 요청이 많아요. 잠시 후 다시 시도해주세요.');
    }

    this.activeStreams += 1;
    try {
      const userMsg = await this.prisma.counselingMessage.create({ data: { sessionId, role: 'user', text } });

      // 단서 추출 (실패해도 흐름 유지 — signals.ts 내 폴백)
      const extracted = await extractSignals(text);
      if (extracted.length) {
        await this.prisma.counselingSignal.createMany({
          data: extracted.map((s) => ({ sessionId, tag: s.tag, text: s.text, confidence: s.confidence, sourceMessageId: userMsg.id })),
        });
      }

      // RAG 컨텍스트 — 탐색 단계에선 도구 결과를 주지 않아 자유 대화 유지(프롬프트 단계 설계와 일치)
      const stageInfo = await this.stageOf(sessionId);
      const session = await this.prisma.counselingSession.findUnique({ where: { id: sessionId }, include: { user: true } });
      const grade = session?.user.grade ?? null;
      const isTeacher = session?.user.role === 'teacher';
      // 교사 코칭 모드는 항상 RAG(학과·진로·대학 데이터)를 제공. 학생은 탐색 단계에선 자유 대화 유지.
      const docs = (isTeacher || stageInfo.stage !== 'explore') ? await this.retriever.retrieve(text, 6) : [];
      let ragContext = docs.map((d) => `[${d.kind}] ${d.title}: ${d.body}`).join('\n');
      // prepare 단계 또는 초·중 학년이면 학년에 맞는 진로교육자료를 함께 제공
      if (grade && (stageInfo.stage === 'prepare' || stageInfo.stage === 'recommend')) {
        const targetCode = gradeToTarget(grade);
        const materials = await this.prisma.careerEducationMaterial.findMany({
          where: { target: { in: [targetCode, 'C'] }, activityType: { in: ['진로·직업체험', '진로심리검사', '진로상담', '직업정보'] } },
          take: 4,
          orderBy: { selCount: 'desc' },
        });
        if (materials.length) {
          ragContext += '\n[자료] ' + materials.map((m) => `${m.title} (${m.activityType ?? ''}, ${m.year ?? ''})`).join(' / ');
        }
      }

      // 도구 호출 — 학생 메시지 키워드 감지 시 해당 API 결과를 RAG에 자동 추가.
      // AI는 이 데이터를 인용해서만 구체적 사실을 말한다 (prompt.md 사실 근거 원칙).
      const lower = text;
      if (/봉사|봉사활동/.test(lower)) {
        const vols = await this.prisma.volunteerOpportunity.findMany({
          where: { youthEligible: true, ...(grade?.startsWith('H') ? {} : {}) },
          take: 5,
          orderBy: { id: 'desc' },
        });
        if (vols.length) ragContext += '\n[봉사] ' + vols.map((v) => `${v.title} [${v.region ?? ''}]`).join(' / ');
      }
      if (/해외|유학|외국|미국|일본|영국|독일|호주|중국|캐나다/.test(lower)) {
        const foreign = await this.prisma.foreignUniversity.findMany({ take: 5, orderBy: { nameKo: 'asc' } });
        if (foreign.length) ragContext += '\n[해외대학] ' + foreign.map((u) => `${u.nameKo}(${u.countryKo})`).join(' / ');
      }
      if (/체험|직업체험|진로체험|현장학습/.test(lower)) {
        const mat = await this.prisma.careerEducationMaterial.findMany({
          where: { activityType: '진로·직업체험', target: { in: [grade ? gradeToTarget(grade) : 'C', 'C'] } },
          take: 4,
          orderBy: { selCount: 'desc' },
        });
        if (mat.length) ragContext += '\n[체험자료] ' + mat.map((m) => m.title).join(' / ');
      }

      // 히스토리 (최근 20개로 제한 — 토큰 가드)
      const history = await this.prisma.counselingMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });
      const messages = history.map((m) => ({ role: m.role === 'user' ? ('user' as const) : ('assistant' as const), content: m.text }));

      // 단계·단서·학년을 자연어 안내로 주입 → AI가 단계적으로 진행 (prompt.md 단계 설계).
      // 구조화 태그(<state>)는 모델이 응답에 모방·누수하므로 자연어 문장으로 전달한다.
      const stageLabel = { explore: '탐색(질문으로 파악)', profile: '파악(정리·확인 후 제안)', recommend: '추천(데이터 근거 직업·전공·대학)', prepare: '준비(입시·성적 연결)' }[stageInfo.stage];
      const signalSummary = stageInfo.signals.map((s) => `[${s.tag}]${s.text}`).join(', ') || '아직 없음';
      const gradeLabel = grade ? gradeKoreanLabel(grade) : '미확인';
      const systemWithState = isTeacher
        ? TEACHER_COACH_PROMPT
        : `${SYSTEM_PROMPT}\n\n[상담 단계 안내 — 내부 정보, 응답에 노출 금지] 현재 단계: ${stageLabel}. 지금까지 모은 단서(${stageInfo.signals.length}개): ${signalSummary}. 학생 발화 ${stageInfo.userTurns}회. 이 단계에 맞게만 응답하라.\n` +
          `[학생 학년 안내 — 내부 정보, 응답에 노출 금지] 학년: ${gradeLabel}. 위 "학년별 톤·내용 지침"을 그대로 따르라.`;

      const aiMsg = await this.prisma.counselingMessage.create({ data: { sessionId, role: 'ai', text: '' } });
      const streamChannel = `sse:aimsg:${aiMsg.id}`;
      let fullText = '';
      let usage: unknown = null;

      try {
        for await (const ev of aiClient.streamChat({ tier: 'light', system: systemWithState, ragContext, messages, signal })) {
          if (ev.type === 'token') {
            fullText += ev.text;
            callbacks.onToken(ev.text);
            // GET /stream 재수신용 버퍼 (비동기 — 토큰 지연 방지 위해 await 안 함)
            void this.pubsub.publish(streamChannel, 'token', { delta: ev.text });
          } else {
            usage = ev.usage;
          }
        }
      } catch (e) {
        // 부분 응답 저장 후 에러 전파 — 스트림 중단/429/529 등은 컨트롤러가 SSE error 이벤트로 변환
        await this.prisma.counselingMessage.update({ where: { id: aiMsg.id }, data: { text: fullText } });
        void this.pubsub.publish(streamChannel, 'error', { code: e instanceof AppError ? e.code : 'AI_UNAVAILABLE' });
        throw e;
      }

      // 방어적 정리 — 모델이 단계 안내/내부 태그를 응답에 누수하면 제거 (프롬프트 지시 + 이중 안전망)
      fullText = stripLeakedState(fullText);
      await this.prisma.counselingMessage.update({ where: { id: aiMsg.id }, data: { text: fullText } });
      const prog = await this.progressOf(sessionId);
      const donePayload = {
        messageId: aiMsg.id,
        signals: extracted.map((s, i) => ({ ...s, sourceMessageId: userMsg.id, id: `${userMsg.id}:${i}` })),
        usage,
        completeness: prog.completeness,
        stage: prog.stage,
      };
      void this.pubsub.publish(streamChannel, 'done', donePayload);
      callbacks.onDone(donePayload);
      logger.info({ sessionId, usage }, 'ai message completed');
    } finally {
      this.activeStreams -= 1;
    }
  }

  /** 즉답 모드 (?stream=false) — SSE 없이 JSON 반환 */
  async sendMessageSync(userId: string, sessionId: string, text: string) {
    let result: { messageId: string; signals: unknown[]; usage: unknown; completeness: number } | null = null;
    let full = '';
    await this.sendMessage(userId, sessionId, text, new AbortController().signal, {
      onToken: (t) => {
        full += t;
      },
      onDone: (p) => {
        result = p;
      },
    });
    const done = result as unknown as { messageId: string; signals: unknown[]; usage: unknown; completeness: number };
    return { data: { message: { id: done.messageId, role: 'ai', text: full }, signals: done.signals, completeness: done.completeness, usage: done.usage } };
  }

  // ─── 리포트 ───

  async generateReport(userId: string, sessionId: string) {
    await this.getOwnedSession(userId, sessionId);
    const prog = await this.progressOf(sessionId);
    if (prog.evidenceCount < REPORT_MIN_EVIDENCE) {
      throw new AppError(
        ErrorCode.AI_NOT_ENOUGH_EVIDENCE,
        `리포트를 만들려면 대화가 조금 더 필요해요. (단서 ${prog.evidenceCount}/${REPORT_MIN_EVIDENCE})`,
        { details: { evidenceCount: prog.evidenceCount, required: REPORT_MIN_EVIDENCE } },
      );
    }

    const [messages, signals, user] = await Promise.all([
      this.prisma.counselingMessage.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' } }),
      this.prisma.counselingSignal.findMany({ where: { sessionId } }),
      this.prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    ]);

    // 멱등키 — 동일 세션+동일 대화 내용이면 기존 리포트 반환 (DECISIONS #29)
    const contentHash = createHash('sha256')
      .update(sessionId + '|' + messages.map((m) => m.id).join(','))
      .digest('hex')
      .slice(0, 32);
    const idempotencyKey = `report:${sessionId}:${contentHash}`;
    const existing = await this.prisma.report.findUnique({ where: { idempotencyKey } });
    if (existing) {
      // enqueue 실패로 잡이 없는 채 남았거나(failed 포함) — 재enqueue로 복구 (멱등 jobId라 중복 없음)
      if ((existing.status === 'queued' && !existing.jobId) || existing.status === 'failed') {
        const job = await getQueues().pdf.add('render', { reportId: existing.id, userId }, { jobId: `pdf-${existing.id}` });
        await this.prisma.report.update({ where: { id: existing.id }, data: { jobId: job.id, status: 'queued', error: null } });
        return { data: { reportId: existing.id, jobId: job.id, status: 'queued' } };
      }
      return { data: { reportId: existing.id, jobId: existing.jobId, status: existing.status } };
    }

    const content = await this.synthesizeReport(user.name, messages, signals);
    let report;
    try {
      report = await this.prisma.report.create({
        data: { sessionId, userId, content: content as object, idempotencyKey, status: 'queued' },
      });
    } catch (e) {
      // 동시 중복 요청 레이스(P2002 unique) — 멱등: 먼저 생성된 리포트를 반환
      if ((e as { code?: string }).code === 'P2002') {
        const winner = await this.prisma.report.findUnique({ where: { idempotencyKey } });
        if (winner) return { data: { reportId: winner.id, jobId: winner.jobId, status: winner.status } };
      }
      throw e;
    }
    const job = await getQueues().pdf.add(
      'render',
      { reportId: report.id, userId },
      { jobId: `pdf-${report.id}` }, // jobId 멱등 — 같은 리포트 중복 enqueue 방지 (':'는 BullMQ 금지 문자)
    );
    await this.prisma.report.update({ where: { id: report.id }, data: { jobId: job.id } });
    return { data: { reportId: report.id, jobId: job.id, status: 'queued' } };
  }

  async getReport(userId: string, reportId: string) {
    const report = await this.prisma.report.findUnique({ where: { id: reportId } });
    if (!report || report.userId !== userId) {
      throw new AppError(ErrorCode.REPORT_NOT_FOUND, '리포트를 찾을 수 없어요.');
    }
    return {
      data: {
        id: report.id,
        sessionId: report.sessionId,
        status: report.status,
        content: report.content,
        jobId: report.jobId,
        createdAt: report.createdAt.toISOString(),
      },
    };
  }

  /** 리포트 합성 — heavy(Sonnet) 모델, mock이면 시그널 기반 결정적 생성 */
  private async synthesizeReport(
    studentName: string,
    messages: { role: string; text: string }[],
    signals: { tag: string; text: string }[],
  ): Promise<Record<string, unknown>> {
    const disclaimer =
      '이 리포트는 AI가 학생과의 대화에서 추출한 단서를 바탕으로 만든 잠정 가설이에요. 확정된 진로 판정이 아니며, 큰 결정은 부모님·선생님·전문 상담사와 함께 의논해주세요.';
    const base = {
      student: studentName,
      generated: new Date().toISOString().slice(0, 10),
      turns: messages.filter((m) => m.role === 'user').length,
      signals: signals.map((s) => ({ tag: s.tag, text: s.text })),
      disclaimer,
      provisional: true,
    };

    if (aiClient.provider === 'mock') {
      const interests = signals.filter((s) => s.tag === '흥미').map((s) => s.text);
      return {
        ...base,
        headline: '탐색 단서를 바탕으로 한 잠정 진로 가설',
        summary: `대화에서 ${signals.length}개의 단서를 발견했어요. ${interests[0] ? `특히 "${interests[0].slice(0, 30)}" 관련 흥미가 두드러져요.` : '흥미 단서를 더 모아보면 좋겠어요.'}`,
        careers: [
          { title: '미디어 콘텐츠 디자이너', score: 87, why: '시각적 표현과 콘텐츠 제작 흥미 단서 기반' },
          { title: '영상 편집자', score: 81, why: '편집 과정 몰입 단서 기반' },
          { title: 'UX 디자이너', score: 74, why: '사용자 반응에 대한 관심 단서 기반' },
        ],
        majors: ['디지털콘텐츠디자인학과', '영상디자인학과', '미디어커뮤니케이션학과'],
        strengths: signals.filter((s) => s.tag === '강점').map((s) => s.text.slice(0, 40)),
        risks: ['진로 가설이 아직 초기 단계라 더 많은 탐색이 필요해요.'],
        nextActions: ['관심 직업 하나를 골라 직업백과에서 하는 일을 읽어보기', '관련 학과의 교육과정 살펴보기', '이번 주에 관련 활동 1개 해보고 기록 남기기'],
      };
    }

    const transcript = messages.map((m) => `${m.role === 'user' ? '학생' : 'AI'}: ${m.text}`).join('\n').slice(0, 12_000);
    const { text } = await aiClient.complete({
      tier: 'heavy',
      system:
        SYSTEM_PROMPT +
        '\n\n지금은 리포트 합성 모드다. 대화 전체와 단서를 보고 진로 리포트를 JSON으로만 출력하라. ' +
        '마크다운 코드펜스(```) 없이 순수 JSON 객체 하나만 출력한다. ' +
        '형식: {"headline":string,"summary":string,"careers":[{"title":string,"score":number,"why":string}],"majors":string[],"strengths":string[],"risks":string[],"nextActions":string[]}. ' +
        'careers는 3개, majors는 3~5개로 간결하게. 단정 금지("꼭 ~가 될 거야" 금지), 잠정 가설로 표현, 현실적 어려움도 균형 있게.',
      messages: [{ role: 'user', content: `<단서>\n${JSON.stringify(signals)}\n</단서>\n<대화>\n${transcript}\n</대화>` }],
      maxTokens: 2500, // 한국어 리포트 JSON이 1500토큰에서 잘려 파싱 실패하던 문제 (실키 검증으로 발견)
    });
    const parsed = parseReportJson(text);
    if (parsed) return { ...base, ...parsed };
    logger.warn('report JSON parse failed — wrapping raw text');
    return { ...base, headline: '진로 탐색 리포트', summary: stripFence(text).slice(0, 500), careers: [], majors: [], strengths: [], risks: [], nextActions: [] };
  }

  private sessionDto(s: { id: string; status: string; startedAt: Date; endedAt: Date | null }) {
    return { id: s.id, status: s.status, startedAt: s.startedAt.toISOString(), endedAt: s.endedAt ? s.endedAt.toISOString() : null };
  }

  private signalDto(s: { id: string; tag: string; text: string; sourceMessageId: string | null; confidence: string }) {
    return { id: s.id, tag: s.tag, text: s.text, sourceMessageId: s.sourceMessageId, confidence: s.confidence };
  }

  get activeStreamCount(): number {
    return this.activeStreams;
  }
}
