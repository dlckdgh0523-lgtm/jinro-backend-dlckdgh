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
import { z } from 'zod';

// 리포트 JSON 검증 스키마 — 모델 출력이 일부 깨져도 필드별 .catch 기본값으로 안전 정규화(절대 throw 안 함).
const ReportSchema = z.object({
  headline: z.string().catch(''),
  summary: z.string().catch(''),
  careers: z.array(
    z.object({ title: z.string().catch(''), score: z.coerce.number().catch(0), why: z.string().catch('') }).catch({ title: '', score: 0, why: '' }),
  ).catch([]),
  majors: z.array(z.string()).catch([]),
  strengths: z.array(z.string()).catch([]),
  risks: z.array(z.string()).catch([]),
  nextActions: z.array(z.string()).catch([]),
});

// AI 진로상담 오케스트레이션 — 세션/메시지/시그널/진행도/리포트.
// completeness는 고정 step이 아니라 evidence(시그널) 기반 (FRONTEND_CONTRACT §2.4).

const REPORT_MIN_EVIDENCE = 5;

// 합격 가능성(입결) 환각 차단 — 시스템 프롬프트에 강하게 주입.
// 우리 DB에는 대학 단위 경쟁률/충원율/등록률만 있고, 학과별 합격선/내신 등급컷(입결)은 없다.
// 따라서 "내신 N등급 → OO대 안정/적정/소신" 같은 판정은 근거가 없으므로 절대 지어내지 않게 한다.
const ADMISSION_GUARD = [
  '[입시·합격 가능성 — 매우 중요한 원칙]',
  '- 합격선·내신 등급컷·표준점수컷, 그리고 "안정/적정/소신/상향/하향" 같은 합격 가능성 판정은,',
  '  제공된 [참고 데이터]에 그 수치가 실제로 있을 때만 말하라. 데이터에 없으면 절대 추측하지 말 것.',
  '- 학과별 합격선(입결) 데이터는 아직 제공되지 않는다. 그러므로 "내신 몇 등급이면 어느 대학 가능"',
  '  같은 합격 가능성 판정은 하지 말고, "학과별 합격선(입결) 데이터는 아직 제공되지 않아 정확한',
  '  합격 가능성은 말씀드리기 어려워요"라고 솔직히 밝혀라.',
  '- 대신 우리가 가진 정보(대학 단위 경쟁률·충원율·등록률, 계열, 학과 개설 여부)만 근거로 제시하라.',
  '  이 수치는 [대학지표]로 제공되며, 인용할 때 출처와 조사년도를 함께 밝혀라.',
  '- 입시·합격 관련 답변 끝에는 "※ 참고용이며 정확한 합격선·전형은 어디가(adiga.kr)와 입학처,',
  '  담임 선생님 상담에서 확인하세요." 같은 안내를 자연스럽게 한 번 덧붙여라(매 문장 강제 금지).',
].join('\n');

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

/** AI가 응답 끝에 함께 출력하는 메타블록의 스키마. 추가 LLM 호출 없이 단서·종료·진로목표 제안을 받는다. */
export interface AiMeta {
  signals: { tag: '흥미' | '강점' | '가치' | '맥락'; text: string; confidence?: 'high' | 'mid' | 'low' }[];
  shouldFinalize: boolean;
  finalizeReason?: string;
  /** AI가 학생이 마음에 들어한다고 판단한 진로 목표 후보 (학생 1클릭으로 저장). 미제안 시 null. */
  proposedTarget?: { career?: string; univ?: string; dept?: string; reason?: string } | null;
}

/**
 * 응답 본문에서 메타블록 `<meta>{...}</meta>`을 추출(파싱)한다. 없거나 깨지면 null.
 * 응답에 노출되면 안 되므로 추출 후 본문에서 제거하는 건 stripLeakedState가 담당.
 */
export function parseAiMeta(text: string): AiMeta | null {
  const m = /<meta>\s*([\s\S]*?)\s*<\/meta>/i.exec(text);
  if (!m) return null;
  try {
    const obj = JSON.parse(m[1]!) as Partial<AiMeta>;
    const signals = Array.isArray(obj.signals) ? obj.signals.filter((s) =>
      s && typeof s.text === 'string' && s.text.length > 0 && ['흥미','강점','가치','맥락'].includes(s.tag as string),
    ).map((s) => ({ tag: s.tag, text: String(s.text).slice(0, 200), confidence: (s.confidence ?? 'mid') as 'high' | 'mid' | 'low' })) : [];
    // proposedTarget 파싱 — 객체이고 어느 한 필드라도 있으면 채택
    let proposedTarget: AiMeta['proposedTarget'] = null;
    const pt = obj.proposedTarget;
    if (pt && typeof pt === 'object') {
      const career = typeof pt.career === 'string' ? pt.career.slice(0, 80) : undefined;
      const univ = typeof pt.univ === 'string' ? pt.univ.slice(0, 80) : undefined;
      const dept = typeof pt.dept === 'string' ? pt.dept.slice(0, 80) : undefined;
      const reason = typeof pt.reason === 'string' ? pt.reason.slice(0, 200) : undefined;
      if (career || univ || dept) proposedTarget = { career, univ, dept, reason };
    }
    return {
      signals: signals as AiMeta['signals'],
      shouldFinalize: obj.shouldFinalize === true,
      finalizeReason: typeof obj.finalizeReason === 'string' ? obj.finalizeReason.slice(0, 200) : undefined,
      proposedTarget,
    };
  } catch {
    return null;
  }
}

/** 모델이 응답에 누수한 단계 안내/내부 태그/메타블록 제거 (이중 안전망) */
export function stripLeakedState(text: string): string {
  return text
    .replace(/<meta>[\s\S]*?<\/meta>/gi, '') // 메타블록(닫힌 형태) — parseAiMeta가 먼저 추출
    .replace(/<meta>[\s\S]*$/i, '')          // 메타블록(스트림 중단 등으로 잘린 형태)
    .replace(/<state>[\s\S]*?<\/state>/gi, '')
    .replace(/<state>[\s\S]*$/i, '') // 닫는 태그 없이 잘린 경우
    .replace(/\[상담 단계 안내[\s\S]*$/i, '')
    .replace(/\[학생 학년 안내[\s\S]*$/i, '')
    .replace(/\[학생 성적[\s\S]*$/i, '')
    .replace(/\[형식 지침[\s\S]*$/i, '')
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

/** 성적 레코드 배열 → 시스템 프롬프트용 짧은 요약 (없으면 null) */
export function summarizeGrades(
  grades: { term: string; subject: string; category: string | null; score: number | null; rank: number | null }[],
): string | null {
  if (!grades.length) return null;
  // 최신 학기 우선 — term 내림차순 정렬 후 상위 학기만 사용 (토큰 절약)
  const sorted = [...grades].sort((a, b) => (a.term < b.term ? 1 : a.term > b.term ? -1 : 0));
  const latestTerm = sorted[0]!.term;
  const latest = sorted.filter((g) => g.term === latestTerm);
  const parts = latest.slice(0, 8).map((g) => {
    const label = g.subject || g.category || '과목';
    const bits: string[] = [];
    if (g.rank != null) bits.push(`${g.rank}등급`);
    if (g.score != null) bits.push(`${g.score}점`);
    return bits.length ? `${label} ${bits.join('·')}` : label;
  });
  const ranks = latest.map((g) => g.rank).filter((r): r is number => r != null);
  const avg = ranks.length ? (ranks.reduce((a, r) => a + r, 0) / ranks.length).toFixed(1) : null;
  const head = avg ? `최근 학기(${latestTerm}) 평균 ${avg}등급` : `최근 학기(${latestTerm})`;
  return `${head} — ${parts.join(', ')}`;
}

/** School.raw.admissions 의 형태 (대학알리미 적재 — ingest.worker.ts 참고) */
interface AdmissionsRaw {
  competitionRate?: number | null;
  freshmanFillRate?: number | null;
  finalRegistrationRate?: number | null;
  svyYr?: number;
  source?: string;
}

/**
 * 텍스트에서 "OO대/OO대학교" 형태의 대학명 토큰을 추출한다(간단 매칭).
 * 정식 매칭은 DB 조회( buildUniversityMetrics )에서 School.name LIKE 로 한다 — 여기선 후보만 뽑는다.
 */
export function extractUniversityNames(text: string): string[] {
  const out = new Set<string>();
  // "가천대", "서울대학교", "한국외국어대학교" 등 — 한글 2~10자 + 대/대학/대학교
  const re = /([가-힣]{2,10}?)(?:대학교|대학|대)(?![가-힣])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const stem = m[1]!.trim();
    // 너무 일반적인 어휘 오탐 방지 (예: "우리대", "이번대")
    if (stem.length >= 2 && !/^(우리|이번|저번|그|이|저|어느|무슨|어떤)$/.test(stem)) out.add(stem);
  }
  return [...out];
}

/** AdmissionsRaw + 학교명 → "[대학지표] OO대: 경쟁률 X:1, 충원율 Y%, 등록률 Z% (출처, 조사년도)" 한 줄. 값이 하나도 없으면 null. */
export function formatAdmissionMetricLine(name: string, a: AdmissionsRaw): string | null {
  const bits: string[] = [];
  if (a.competitionRate != null) bits.push(`경쟁률 ${a.competitionRate}:1`);
  if (a.freshmanFillRate != null) bits.push(`충원율 ${a.freshmanFillRate}%`);
  if (a.finalRegistrationRate != null) bits.push(`등록률 ${a.finalRegistrationRate}%`);
  if (!bits.length) return null;
  const src = a.source ?? '대학알리미';
  const yr = a.svyYr != null ? `, 조사년도 ${a.svyYr}` : '';
  return `[대학지표] ${name}: ${bits.join(', ')} (출처 ${src}${yr})`;
}

/** 단위테스트 전용 export */
export const __test = { parseReportJson, stripFence, stripLeakedState, parseAiMeta, gradeToTarget, gradeKoreanLabel, summarizeGrades, extractUniversityNames, formatAdmissionMetricLine };

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

  /**
   * 세션 생성.
   * - 학생/단일 모드(subjectStudentId 없음): 기존 active 세션은 종료(한 사용자당 1개 유지).
   * - 교사 코칭 모드(subjectStudentId 있음): 학생별로 여러 세션 동시 active 가능(대화창 목록).
   *   같은 학생 대상 active 세션이 이미 있으면 그걸 재사용(중복 생성 방지).
   */
  async createSession(userId: string, opts?: { subjectStudentId?: string | null; title?: string | null }) {
    const subjectStudentId = opts?.subjectStudentId || null;
    const title = (opts?.title ?? '').trim().slice(0, 80) || null;
    if (subjectStudentId) {
      // 교사 코칭 모드 — 같은 학생 active 세션 재사용
      const existing = await this.prisma.counselingSession.findFirst({
        where: { userId, subjectStudentId, status: 'active' },
        orderBy: { startedAt: 'desc' },
      });
      if (existing) return { data: this.sessionDto(existing) };
      const session = await this.prisma.counselingSession.create({ data: { userId, subjectStudentId, title } });
      return { data: this.sessionDto(session) };
    }
    // 일반(학생) 모드 — 기존 active 종료 후 새로
    await this.prisma.counselingSession.updateMany({
      where: { userId, status: 'active', subjectStudentId: null },
      data: { status: 'ended', endedAt: new Date() },
    });
    const session = await this.prisma.counselingSession.create({ data: { userId, title } });
    return { data: this.sessionDto(session) };
  }

  /** 사용자의 세션 목록 — 교사 대화창 사이드바용. status로 필터 가능. */
  async listSessions(userId: string, opts?: { status?: 'active' | 'ended' | 'all' }) {
    const status = opts?.status ?? 'all';
    const sessions = await this.prisma.counselingSession.findMany({
      where: { userId, ...(status !== 'all' ? { status } : {}) },
      orderBy: { startedAt: 'desc' },
      take: 100,
    });
    // 학생 정보(이름) 함께 — 교사 대화창 목록에 표시
    const studentIds = [...new Set(sessions.map((s) => s.subjectStudentId).filter((x): x is string => !!x))];
    const students = studentIds.length
      ? await this.prisma.user.findMany({ where: { id: { in: studentIds } }, select: { id: true, name: true } })
      : [];
    const studentMap = new Map(students.map((s) => [s.id, s.name]));
    return {
      data: sessions.map((s) => ({
        ...this.sessionDto(s),
        title: s.title,
        subjectStudentId: s.subjectStudentId,
        subjectStudentName: s.subjectStudentId ? studentMap.get(s.subjectStudentId) ?? null : null,
      })),
    };
  }

  /** 세션 제목 변경 또는 종료. */
  async updateSession(userId: string, sessionId: string, patch: { title?: string | null; status?: 'active' | 'ended' }) {
    await this.getOwnedSession(userId, sessionId);
    const data: Record<string, unknown> = {};
    if (patch.title !== undefined) data.title = patch.title ? patch.title.trim().slice(0, 80) : null;
    if (patch.status === 'ended') { data.status = 'ended'; data.endedAt = new Date(); }
    if (patch.status === 'active') { data.status = 'active'; data.endedAt = null; }
    const session = await this.prisma.counselingSession.update({ where: { id: sessionId }, data });
    return { data: this.sessionDto(session) };
  }

  /** 세션 삭제 — 메시지/시그널/리포트 cascade. */
  async deleteSession(userId: string, sessionId: string) {
    await this.getOwnedSession(userId, sessionId);
    await this.prisma.counselingSession.delete({ where: { id: sessionId } });
    return { data: { ok: true } };
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
    // 단계 진행 — evidence(단서) 기반. AI가 메타블록(parseAiMeta)에서 매 응답마다 새 단서를 적극적으로
    // 뽑아 누적되므로, 임계값을 낮춰도 같은 주제 반복 없이 자연스럽게 진행된다.
    // explore: 단서 2개 미만 / profile: 단서 4개 미만 / 그 이후 recommend(또는 목표 있으면 prepare).
    if (signals.length < 2) stage = 'explore';
    else if (signals.length < 4) stage = 'profile';
    else stage = hasTarget > 0 ? 'prepare' : 'recommend';
    return { stage, signals: signals.map((s) => ({ tag: s.tag, text: s.text })), userTurns };
  }

  /**
   * 실데이터 grounding — 대화/추천 대상 대학의 경쟁률·충원율·등록률(School.raw.admissions)을 결정적으로 주입.
   * retriever 의미검색에만 의존하면 누락되므로, 대학명 후보를 추출해 School 레코드를 직접 조회한다.
   * 데이터가 없으면 줄을 만들지 않는다(없는 걸 지어내지 않음).
   * @param recentTexts 최근 대화/추천 대상 텍스트들 (대학명 추출 소스)
   */
  private async buildUniversityMetrics(recentTexts: string[]): Promise<string[]> {
    const stems = [...new Set(recentTexts.flatMap((t) => extractUniversityNames(t)))].slice(0, 6);
    if (!stems.length) return [];
    // School.name LIKE 로 후보 학교를 모은다(스템당 소수). admissions 가 있는 것만 사용.
    const seen = new Set<string>();
    const lines: string[] = [];
    for (const stem of stems) {
      let schools: { name: string; raw: unknown }[] = [];
      try {
        schools = await this.prisma.school.findMany({
          where: { name: { contains: stem } },
          select: { name: true, raw: true },
          take: 3,
        });
      } catch (e) {
        logger.warn({ stem, err: (e as Error).message }, 'school metric lookup failed');
        continue;
      }
      for (const s of schools) {
        if (seen.has(s.name)) continue;
        const admissions = (s.raw as Record<string, unknown> | null)?.['admissions'] as AdmissionsRaw | undefined;
        if (!admissions) continue;
        const line = formatAdmissionMetricLine(s.name, admissions);
        if (line) {
          lines.push(line);
          seen.add(s.name);
        }
      }
      if (lines.length >= 6) break;
    }
    return lines.slice(0, 6);
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
      // 성적 반영 — 학생 본인 성적을 짧게 요약해 시스템 프롬프트에 주입 (없으면 null → AI가 자연스럽게 학년/성적대 물음)
      const gradeRows = session ? await this.prisma.grade.findMany({ where: { userId: session.userId } }) : [];
      const gradesSummary = summarizeGrades(gradeRows);
      // 교사 코칭 모드는 항상 RAG(학과·진로·대학 데이터)를 제공. 학생은 탐색 단계에선 자유 대화 유지.
      const docs = (isTeacher || stageInfo.stage !== 'explore') ? await this.retriever.retrieve(text, 6) : [];
      let ragContext = docs.map((d) => `[${d.kind}] ${d.title}: ${d.body}`).join('\n');

      // 교사 코칭 모드 + 특정 학생 세션이면 그 학생 컨텍스트(성적·AI 단서·진로목표)를 자동 주입.
      // 매번 학생 정보를 다시 묻지 않게 하기 위한 핵심 — 사용자 요청: "등록된 학생마다 성적 입력해둔거 알아서 봐오고 했으면 좋겠다".
      if (isTeacher && session?.subjectStudentId) {
        const studentId = session.subjectStudentId;
        const [student, sGrades, sSignals, sTargets] = await Promise.all([
          this.prisma.user.findUnique({ where: { id: studentId }, select: { name: true, grade: true, school: true, classroom: true } }),
          this.prisma.grade.findMany({ where: { userId: studentId } }),
          // 그 학생의 AI 상담 세션들에서 누적된 단서
          this.prisma.counselingSignal.findMany({
            where: { session: { userId: studentId } },
            orderBy: { createdAt: 'desc' },
            take: 12,
            select: { tag: true, text: true },
          }),
          this.prisma.careerTarget.findMany({ where: { userId: studentId }, orderBy: { createdAt: 'desc' }, take: 5 }),
        ]);
        if (student) {
          const sGradeSummary = summarizeGrades(sGrades);
          const sigLine = sSignals.length ? sSignals.map((s) => `[${s.tag}]${s.text}`).join(', ') : '아직 없음';
          const tgtLine = sTargets.length
            ? sTargets.map((t) => [t.career, t.univ, t.dept].filter(Boolean).join(' · ')).join(' / ')
            : '아직 없음';
          const studentCtx = [
            `[상담 대상 학생] ${student.name} (${gradeKoreanLabel(student.grade || '') || '학년 미입력'}` + (student.classroom ? `, ${student.school ?? ''} ${student.classroom}` : '') + ')',
            sGradeSummary ? `[학생 성적 요약] ${sGradeSummary}` : `[학생 성적] 미입력`,
            `[학생이 모은 진로 단서(최신 12개)] ${sigLine}`,
            `[학생의 진로 목표] ${tgtLine}`,
          ].join('\n');
          ragContext = studentCtx + (ragContext ? '\n\n' + ragContext : '');
        }
      }
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

      // 실데이터 grounding — recommend/prepare 단계에서 대화에 등장하는 대학의 경쟁률·충원율·등록률을
      // School.raw.admissions에서 직접 조회해 결정적으로 주입한다(retriever 의미검색 누락 보강).
      // 최근 사용자 발화 몇 개 + 방금 메시지에서 대학명 후보를 추출한다.
      if (stageInfo.stage === 'recommend' || stageInfo.stage === 'prepare') {
        const recentUserMsgs = await this.prisma.counselingMessage.findMany({
          where: { sessionId, role: 'user' },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: { text: true },
        });
        const metricLines = await this.buildUniversityMetrics([text, ...recentUserMsgs.map((m) => m.text)]);
        if (metricLines.length) ragContext += '\n' + metricLines.join('\n');
      }

      // RAG 컨텍스트 길이 가드 — recommend/prepare에서 도구 결과가 누적되면 입력 상한(AI_MAX_INPUT_CHARS)을
      // 넘겨 'AI_CONTEXT_TOO_LARGE'로 실패(=대학 추천 멈춤)하던 문제. 컨텍스트를 잘라 항상 응답이 끝나게 한다.
      if (ragContext.length > 8_000) ragContext = ragContext.slice(0, 8_000);

      // 히스토리 (최근 20개 + 메시지당 길이 가드 — 긴 대화에서 입력 상한 초과로 스트림이 끝까지 안 가던 문제 방어)
      const history = await this.prisma.counselingMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      const messages = history
        .reverse()
        .map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('assistant' as const),
          content: m.text.length > 1_500 ? m.text.slice(0, 1_500) : m.text,
        }));

      // 단계·단서·학년을 자연어 안내로 주입 → AI가 단계적으로 진행 (prompt.md 단계 설계).
      // 구조화 태그(<state>)는 모델이 응답에 모방·누수하므로 자연어 문장으로 전달한다.
      const stageLabel = { explore: '탐색(질문으로 파악)', profile: '파악(정리·확인 후 제안)', recommend: '추천(데이터 근거 직업·전공·대학)', prepare: '준비(입시·성적 연결)' }[stageInfo.stage];
      const signalSummary = stageInfo.signals.map((s) => `[${s.tag}]${s.text}`).join(', ') || '아직 없음';
      const gradeLabel = grade ? gradeKoreanLabel(grade) : '미확인';
      // 단계 진행을 적극적으로 — 단서가 충분히 쌓이면 머뭇거리지 말고 다음 단계로 자연스럽게 이끈다.
      const STAGE_GUIDE: Record<string, string> = {
        explore: '아직 탐색 단계지만, 학생이 답을 줄 때마다 단서를 빠르게 모아 2~3턴 안에 파악 단계로 넘어가도록 진행하라. 같은 질문을 반복하지 말 것.',
        profile: '단서가 어느 정도 모였다. 지금까지 들은 것을 짧게 정리해 확인하고, 학생이 동의하면 바로 추천으로 넘어가라. 너무 오래 파악에 머물지 말 것.',
        recommend: '추천 단계다. 데이터 근거로 직업·전공·대학을 구체적으로 제안하라. 학생이 대학 추천을 요청하면 미루지 말고 제공된 [참고 데이터]를 근거로 바로 추천하라. 마음에 드는 진로/학과를 학생이 표현하면 "진로 목표로 저장해두고 준비 단계로 넘어갈까요?"라고 적극 제안하라.',
        prepare: '준비 단계다. 관심 학과의 입시 정보와 학생 성적을 연결해 구체적 실천을 제안하라. 입시 일정·전형·필요 활동을 한두 가지 짚어준 뒤, 학생이 충분히 정리됐다고 느껴지면 "지금까지의 상담을 진로 리포트로 정리해드릴까요?"라고 능동적으로 제안하라. 학생이 긍정하면 메타블록의 shouldFinalize를 true로 설정하라.',
      };
      const gradeContext = gradesSummary
        ? `[학생 성적 — 내부 정보, 응답에 노출 금지] 등록된 성적: ${gradesSummary}. 추천·준비 단계에서 이 성적을 근거로 현실적으로 조언하라. 성적을 단정적으로 평가하지 말고 강점과 보완점을 균형 있게.`
        : `[학생 성적 — 내부 정보, 응답에 노출 금지] 등록된 성적이 없다. 대화 초반에 자연스럽게 한 번, 대략적인 성적대(예: 내신 등급 수준)나 학년을 가볍게 물어보고 그에 맞춰 조언하라. 캐묻지는 말 것.`;
      const formatGuide =
        '[형식 지침] 답변이 길어질 때는 짧은 문단으로 나누고, 줄바꿈을 활용하라. 항목을 나열할 때는 "- " 또는 "1. "로 시작하는 목록을 쓰고 한 줄에 하나씩 적어라. 핵심은 짧은 단락으로, 한 덩어리로 쏟아내지 말 것. ' +
        '대학·학과·전형·경쟁률·취업률·장학금처럼 여러 항목을 항목별로 비교하는 정보는 줄글로 늘어놓지 말고 마크다운 표(table)로 정리해 답하라. ' +
        '표 형식 예: 첫 줄 "| 대학 | 학과 | 전형 |", 둘째 줄 "|---|---|---|", 이후 각 행을 "| 값 | 값 | 값 |"로. 표가 어울리지 않는 짧은 답변에는 표를 쓰지 말 것.';
      // 빠른 답변(quick-reply) 보기 — 학생이 답을 떠올리기 어려울 때 골라서 답할 수 있게 한다.
      // 질문을 던질 때마다 응답의 맨 마지막 줄에 정확히 이 형식으로 한 줄을 붙인다. 이 줄은 프론트가 칩으로 렌더한다.
      const quickReplyGuide =
        '[빠른 답변 보기 지침] 학생에게 질문을 던질 때는, 방금 그 질문에 대해 학생이 실제로 답할 법한 "상황에 맞는" 예시 보기를 응답 맨 마지막 별도 한 줄로 제시하라. 형식은 정확히: "[보기] 짧은답변1 | 짧은답변2 | 짧은답변3". ' +
        '보기는 직전 질문과 지금까지의 대화 맥락에 딱 맞게 매번 새로 만들어라(고정된 일반 문구 금지). 1인칭의 짧고 구체적인 표현으로 2~3개, 가능하면 "아직 잘 모르겠어요" 같은 부담 없는 선택지를 하나 포함하라. ' +
        '질문하지 않는 응답(정리·추천·표 등)에는 [보기] 줄을 붙이지 말 것. 보기 줄 외에 다른 설명을 덧붙이지 말 것.';
      // 메타블록 지침 — AI가 매 응답 끝에 단서·종료 여부를 함께 출력해 별도 호출 없이 #3·#4·#5 통합.
      // 학생에겐 보이지 않는 내부 신호이고, stripLeakedState가 응답에서 제거한다.
      const metaGuide =
        '[메타블록 지침 — 학생에게 보이지 않는 내부 신호, 응답 본문 뒤에 정확히 한 번만 출력하라] ' +
        '답변을 모두 마친 후 마지막 줄에 정확히 다음 형식의 메타블록을 한 번만 출력하라: ' +
        '<meta>{"signals":[{"tag":"흥미|강점|가치|맥락","text":"...80자 이내","confidence":"high|mid|low"}],"shouldFinalize":false,"finalizeReason":"","proposedTarget":null}</meta> ' +
        '· signals: 이번 학생 발화에서 새로 파악된 단서(없으면 빈 배열). 학생이 말한 내용을 기반으로만 — 추측 금지. ' +
        '· shouldFinalize: 다음 중 하나라도 충족되면 true, 아니면 false. (a) 학생이 "리포트", "정리해줘", "마무리", "이제 그만" 같은 종결 의사를 직접 표현했다, ' +
        '(b) 현재 단계가 prepare이고 단서가 4개 이상이며 학생에게 리포트를 제안했고 학생이 긍정했다, ' +
        '(c) 같은 주제를 3턴 이상 맴돌고 있어 리포트로 정리하는 게 학생에게 더 유익하다. 애매하면 false. ' +
        '· finalizeReason: shouldFinalize=true일 때 한 줄 사유(예: "학생이 리포트를 요청했고 단서가 충분히 누적됨"). ' +
        '· proposedTarget: 학생이 이번 대화에서 특정 진로/대학/학과를 마음에 들어 한다고 명확히 판단되면 {career?, univ?, dept?, reason?} 객체로 제안하라(없으면 null). ' +
        '  학생이 한 번 클릭하면 진로 목표로 저장된다 — 그러니 학생이 "관심 있어요", "가고 싶어요", "좋아요" 같이 직접 긍정 표현했을 때만 제안. 추측·강요 금지. ' +
        '  career는 직업/직군(예: "일러스트레이터", "UX 디자이너"), univ/dept는 대학/학과(예: "홍익대학교", "미술학과"). 학생이 대학명만 말하고 학과는 안 정했다면 univ만, 직업만 말했다면 career만. ' +
        '  같은 목표를 이미 제안한 적 있으면 다시 제안하지 말 것. ' +
        '메타블록은 반드시 유효한 JSON 한 줄이어야 하며, 본문에는 절대 인용/노출 금지.';
      const systemWithState = isTeacher
        ? TEACHER_COACH_PROMPT
        : `${SYSTEM_PROMPT}\n\n[상담 단계 안내 — 내부 정보, 응답에 노출 금지] 현재 단계: ${stageLabel}. 지금까지 모은 단서(${stageInfo.signals.length}개): ${signalSummary}. 학생 발화 ${stageInfo.userTurns}회. ${STAGE_GUIDE[stageInfo.stage] ?? '이 단계에 맞게 응답하라.'}\n` +
          `[학생 학년 안내 — 내부 정보, 응답에 노출 금지] 학년: ${gradeLabel}. 위 "학년별 톤·내용 지침"을 그대로 따르라.\n` +
          `${ADMISSION_GUARD}\n${gradeContext}\n${formatGuide}\n${quickReplyGuide}\n${metaGuide}`;

      const aiMsg = await this.prisma.counselingMessage.create({ data: { sessionId, role: 'ai', text: '' } });
      const streamChannel = `sse:aimsg:${aiMsg.id}`;
      let fullText = '';
      let usage: unknown = null;
      // 메타블록 노출 차단 — 스트리밍 중 "<meta" 등장 직전까지만 학생에게 흘리고, 그 이후 토큰은
      // 내부 fullText에만 누적(파싱용). stripLeakedState는 사후 정리지만 화면엔 이미 떴기 때문에 이게 필요.
      // 안전망: 메타가 시작될 가능성이 있는 부분 토큰(예: "<m", "<met")은 버퍼에 잡아두고 다음 토큰을 합쳐 판정.
      let metaStarted = false;
      let pendingTail = ''; // 학생에게 보낼지 보류 중인 꼬리(부분 매치 가능성)
      const META_OPEN = '<meta';
      const flushSafe = (chunk: string): void => {
        if (!chunk) return;
        callbacks.onToken(chunk);
        void this.pubsub.publish(streamChannel, 'token', { delta: chunk });
      };

      try {
        for await (const ev of aiClient.streamChat({ tier: 'light', system: systemWithState, ragContext, messages, signal })) {
          if (ev.type === 'token') {
            fullText += ev.text;
            if (metaStarted) continue; // 이미 메타 진입 — 학생에게 보내지 않음
            // 부분 매치 안전망: 이전 보류 + 이번 토큰을 합쳐서 판정
            const candidate = pendingTail + ev.text;
            const idx = candidate.indexOf(META_OPEN);
            if (idx >= 0) {
              // 메타 시작 발견 — 그 직전까지만 흘리고 이후는 차단
              const safe = candidate.slice(0, idx);
              flushSafe(safe);
              metaStarted = true;
              pendingTail = '';
              continue;
            }
            // 메타 시작 안 됨 — 꼬리(부분 매치 가능성)만 다음 토큰까지 보류, 나머지는 즉시 흘림.
            // "<meta" 5글자라 안전하게 마지막 5자를 잡아둠.
            const HOLD = META_OPEN.length - 1; // 4
            if (candidate.length > HOLD) {
              flushSafe(candidate.slice(0, candidate.length - HOLD));
              pendingTail = candidate.slice(candidate.length - HOLD);
            } else {
              pendingTail = candidate;
            }
          } else {
            usage = ev.usage;
          }
        }
        // 스트림 정상 종료 — 메타가 안 왔으면 보류된 꼬리도 흘림
        if (!metaStarted && pendingTail) flushSafe(pendingTail);
      } catch (e) {
        // 부분 응답 저장 후 에러 전파 — 스트림 중단/429/529 등은 컨트롤러가 SSE error 이벤트로 변환
        await this.prisma.counselingMessage.update({ where: { id: aiMsg.id }, data: { text: fullText } });
        void this.pubsub.publish(streamChannel, 'error', { code: e instanceof AppError ? e.code : 'AI_UNAVAILABLE' });
        throw e;
      }

      // 메타블록 추출 — AI가 응답 끝에 출력한 단서/종료신호. 본문에서 제거하기 전에 먼저 파싱.
      const meta = parseAiMeta(fullText);
      // 방어적 정리 — 모델이 단계 안내/내부 태그/메타블록을 응답에 누수하면 제거 (프롬프트 지시 + 이중 안전망)
      fullText = stripLeakedState(fullText);
      await this.prisma.counselingMessage.update({ where: { id: aiMsg.id }, data: { text: fullText } });

      // 메타가 잡은 추가 단서를 저장 (extractSignals로 못 잡은 것 보강). 같은 문구는 중복 저장 안 함.
      let metaSignalsSaved = 0;
      if (meta && meta.signals.length > 0) {
        const existing = await this.prisma.counselingSignal.findMany({ where: { sessionId }, select: { text: true } });
        const seen = new Set(existing.map((e) => e.text));
        const fresh = meta.signals.filter((s) => !seen.has(s.text));
        if (fresh.length) {
          await this.prisma.counselingSignal.createMany({
            data: fresh.map((s) => ({ sessionId, tag: s.tag, text: s.text, confidence: s.confidence ?? 'mid', sourceMessageId: userMsg.id })),
          });
          metaSignalsSaved = fresh.length;
        }
      }

      const prog = await this.progressOf(sessionId);
      const donePayload = {
        messageId: aiMsg.id,
        signals: extracted.map((s, i) => ({ ...s, sourceMessageId: userMsg.id, id: `${userMsg.id}:${i}` })),
        // 메타블록이 잡은 단서/종료신호를 프론트에 그대로 전달 — 학생이 raw JSON 대신 칩으로 보게.
        metaSignals: (meta?.signals ?? []).map((s, i) => ({ ...s, sourceMessageId: userMsg.id, id: `${userMsg.id}:m${i}` })),
        shouldFinalize: !!meta?.shouldFinalize,
        finalizeReason: meta?.finalizeReason ?? null,
        // AI가 제안한 진로 목표 후보 — 프론트가 "[홍익대 미술학과] 진로 목표로 저장" 1클릭 버튼으로 렌더.
        proposedTarget: meta?.proposedTarget ?? null,
        usage,
        completeness: prog.completeness,
        stage: prog.stage,
      };
      void this.pubsub.publish(streamChannel, 'done', donePayload);
      callbacks.onDone(donePayload);

      // 자동 리포트 — AI가 종료 시점이라고 판단(shouldFinalize=true)했고 단서가 충분(>=5)하면 자동 enqueue.
      // 멱등키는 generateReport 내부가 처리하므로 중복 호출되어도 안전. 비동기로 실행해 응답 흐름 차단 안 함.
      if (meta?.shouldFinalize && prog.evidenceCount >= 5) {
        void this.generateReport(userId, sessionId)
          .then((r) => logger.info({ sessionId, reportId: (r as { data?: { id?: string } })?.data?.id, reason: meta.finalizeReason }, 'auto-finalize report enqueued'))
          .catch((e) => logger.warn({ sessionId, err: (e as Error).message }, 'auto-finalize failed'));
      }
      logger.info({ sessionId, usage, metaSignalsSaved, autoFinalize: !!meta?.shouldFinalize }, 'ai message completed');
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
    const done = result as unknown as { messageId: string; signals: unknown[]; metaSignals?: unknown[]; shouldFinalize?: boolean; finalizeReason?: string | null; proposedTarget?: unknown; usage: unknown; completeness: number; stage?: string };
    return {
      data: {
        message: { id: done.messageId, role: 'ai', text: full },
        signals: done.signals,
        // sync 응답에도 메타 칩 시각화용 정보 포함 — 스트림 모드와 동일한 페이로드 형태.
        metaSignals: done.metaSignals ?? [],
        shouldFinalize: !!done.shouldFinalize,
        finalizeReason: done.finalizeReason ?? null,
        proposedTarget: done.proposedTarget ?? null,
        completeness: done.completeness,
        stage: done.stage,
        usage: done.usage,
      },
    };
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
        'careers는 3개, majors는 3~5개로 간결하게. 단정 금지("꼭 ~가 될 거야" 금지), 잠정 가설로 표현, 현실적 어려움도 균형 있게. ' +
        '합격선·내신 등급컷·"안정/적정/소신" 같은 합격 가능성 판정은 제공된 데이터에 수치가 있을 때만 쓰고, 없으면 절대 지어내지 말 것(학과별 입결 데이터는 제공되지 않는다).',
      messages: [{ role: 'user', content: `<단서>\n${JSON.stringify(signals)}\n</단서>\n<대화>\n${transcript}\n</대화>` }],
      maxTokens: 2500, // 한국어 리포트 JSON이 1500토큰에서 잘려 파싱 실패하던 문제 (실키 검증으로 발견)
    });
    const parsed = parseReportJson(text);
    // zod로 필드 검증·정규화 — 모델이 일부 필드를 깨먹어도 .catch 기본값으로 안전 복구(throw 안 함)
    const fields = ReportSchema.parse(parsed ?? {});
    fields.careers = fields.careers.filter((c) => c.title);
    if (!parsed || (!fields.summary && fields.careers.length === 0)) {
      if (!fields.headline) fields.headline = '진로 탐색 리포트';
      if (!fields.summary) fields.summary = stripFence(text).slice(0, 500);
      logger.warn('report JSON parse weak — zod fallback applied');
    }
    return { ...base, ...fields };
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
