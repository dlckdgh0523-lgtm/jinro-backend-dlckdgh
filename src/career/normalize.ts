import { z } from 'zod';
import { cleanNumber, cleanString, ensureArray, splitList } from './sanitize';
import type {
  NormalizedCounselCase,
  NormalizedEduMaterial,
  NormalizedJob,
  NormalizedJuniorJob,
  NormalizedMajor,
  NormalizedPage,
  NormalizedSchool,
  NormalizedTest,
} from './types';
import { logger } from '../common/logger';

// 외부 응답 방어 검증 — 필드 누락/타입불일치는 허용(레코드 단위 skip)하되 반드시 로깅.
// count가 string으로 오거나 배열이 단일 객체로 오는 케이스를 모두 흡수한다.

const looseRecord = z.record(z.string(), z.unknown());

function warnAnomaly(source: string, reason: string, sample?: unknown): void {
  logger.warn({ source, reason, sample: sample ? JSON.stringify(sample).slice(0, 300) : undefined }, 'careernet anomaly');
}

function asRecord(value: unknown, source: string): Record<string, unknown> | null {
  const parsed = looseRecord.safeParse(value);
  if (!parsed.success) {
    warnAnomaly(source, 'record expected', value);
    return null;
  }
  return parsed.data;
}

/** getOpenApi XML 공통 래퍼: <dataSearch><content>… (content 단일/배열/누락 모두 흡수) */
function xmlContents(data: unknown, source: string): Record<string, unknown>[] {
  const root = asRecord(data, source);
  if (!root) return [];
  const dataSearch = asRecord(root['dataSearch'] ?? root, source);
  if (!dataSearch) return [];
  const contents = ensureArray(dataSearch['content'] as Record<string, unknown> | Record<string, unknown>[] | undefined);
  return contents.map((c) => asRecord(c, source)).filter((c): c is Record<string, unknown> => c !== null);
}

function xmlTotal(data: unknown): number | null {
  const root = looseRecord.safeParse(data);
  if (!root.success) return null;
  const ds = looseRecord.safeParse(root.data['dataSearch']);
  const t = ds.success ? (ds.data['totalCount'] ?? ds.data['@_totalCount']) : root.data['totalCount'];
  return cleanNumber(t);
}

function pick(rec: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (rec[k] !== undefined && rec[k] !== null) return rec[k];
  }
  return undefined;
}

// ─── 직업백과 (JSON: /cnet/front/openapi/jobs.json, /job.json) ───

export function normalizeJob(rec: Record<string, unknown>): NormalizedJob | null {
  const seq = cleanNumber(pick(rec, 'seq', 'job_cd', 'jobCd'));
  const name = cleanString(pick(rec, 'job', 'job_nm', 'jobName', 'name'));
  if (seq === null || name === null) {
    warnAnomaly('jobs', 'missing seq/name', rec);
    return null;
  }
  return {
    seq,
    name,
    summary: cleanString(pick(rec, 'summary', 'work', 'intro')),
    aptitude: cleanString(pick(rec, 'aptitude', 'aptit_name', 'ability')),
    // wage_source는 출처·시점이 포함된 문장(실 API) — AI가 근거 인용해야 하므로 우선
    salary: cleanString(pick(rec, 'salary', 'salery', 'wage_source', 'wage')),
    prospect: cleanString(pick(rec, 'prospect', 'possibility', 'outlook', 'satisfi_source')),
    // 주의: rel_job_nm은 "유사 직업"이지 관련 학과가 아님 (실 API 검증) — raw에만 보존
    relatedMajors: splitList(pick(rec, 'relatedMajors', 'depart', 'related_major')),
    theme: cleanString(pick(rec, 'theme', 'job_ctg_name', 'top_nm', 'category')),
    raw: rec,
  };
}

export function normalizeJobsList(data: unknown): NormalizedPage<NormalizedJob> {
  const root = asRecord(data, 'jobs');
  if (!root) return { items: [], total: null };
  const arr = ensureArray((pick(root, 'jobs', 'list', 'content') ?? []) as Record<string, unknown> | Record<string, unknown>[]);
  const items = arr
    .map((r) => asRecord(r, 'jobs'))
    .filter((r): r is Record<string, unknown> => r !== null)
    .map(normalizeJob)
    .filter((j): j is NormalizedJob => j !== null);
  return { items, total: cleanNumber(pick(root, 'count', 'totalCount', 'total')) };
}

export function normalizeJobDetail(data: unknown): NormalizedJob | null {
  const root = asRecord(data, 'job-detail');
  if (!root) return null;
  const rec = asRecord(pick(root, 'job', 'data', 'content') ?? root, 'job-detail');
  if (!rec) return null;
  // 상세는 baseInfo 중첩 (실 API: baseInfo + departList 등 리스트들)
  const base = asRecord(rec['baseInfo'], 'job-detail') ?? {};
  const job = normalizeJob({ ...rec, ...base });
  if (!job) return null;
  // 실 API: 관련 학과는 departList [{depart_id, depart_name}]
  if (job.relatedMajors.length === 0) {
    const departs = ensureArray(rec['departList'] as Record<string, unknown> | Record<string, unknown>[] | undefined)
      .map((d) => cleanString((d as Record<string, unknown>)['depart_name'] ?? (d as Record<string, unknown>)['departName']))
      .filter((d): d is string => d !== null);
    job.relatedMajors = departs;
  }
  return job;
}

// ─── 주니어직업 (JSON: juniorjobsinfo.json) ───

export function normalizeJuniorJobsList(data: unknown): NormalizedPage<NormalizedJuniorJob> {
  const root = asRecord(data, 'junior-jobs');
  if (!root) return { items: [], total: null };
  const arr = ensureArray(
    (pick(root, 'juniorJobsInfo', 'juniorJobs', 'jobs', 'list') ?? []) as Record<string, unknown> | Record<string, unknown>[],
  );
  const items = arr
    .map((r) => asRecord(r, 'junior-jobs'))
    .filter((r): r is Record<string, unknown> => r !== null)
    .map((rec) => {
      // 실 API 필드: junior_seq, job_nm, job_summary, job_thema_cd (top key는 jobs)
      const seq = cleanNumber(pick(rec, 'seq', 'jobSeq', 'junior_seq'));
      const name = cleanString(pick(rec, 'jobName', 'job', 'name', 'job_nm'));
      if (seq === null || name === null) {
        warnAnomaly('junior-jobs', 'missing seq/name', rec);
        return null;
      }
      return {
        seq,
        name,
        field: cleanString(pick(rec, 'field', 'category', 'jobField', 'job_thema_cd')),
        summary: cleanString(pick(rec, 'summary', 'intro', 'work', 'job_summary')),
        raw: rec,
      } satisfies NormalizedJuniorJob;
    })
    .filter((j): j is NormalizedJuniorJob => j !== null);
  return { items, total: cleanNumber(pick(root, 'count', 'totalCount')) };
}

// ─── 학과 (EUC-KR XML: svcCode=MAJOR / MAJOR_VIEW) ───

export function normalizeMajors(data: unknown): NormalizedPage<NormalizedMajor> {
  const contents = xmlContents(data, 'majors');
  const items = contents
    .map((rec) => {
      const majorSeq = cleanNumber(pick(rec, 'majorSeq', 'seq'));
      const name = cleanString(pick(rec, 'major', 'majorName', 'mClass'));
      if (majorSeq === null || name === null) {
        warnAnomaly('majors', 'missing seq/name', rec);
        return null;
      }
      return {
        majorSeq,
        name,
        // 실 API: lClass=계열, facilName은 학과명 중복 — lClass 우선
        field: cleanString(pick(rec, 'lClass', 'field', 'facilName')),
        summary: cleanString(pick(rec, 'summary', 'intro')),
        // 상세 <department>에 수백 개 학과명이 쉼표 나열되는 함정 — 항상 배열로
        departments: splitList(pick(rec, 'department', 'departments', 'univ')),
        raw: rec,
      } satisfies NormalizedMajor;
    })
    .filter((m): m is NormalizedMajor => m !== null);
  return { items, total: xmlTotal(data) };
}

// ─── 학교 (EUC-KR XML: svcCode=SCHOOL) ───

export function normalizeSchools(data: unknown): NormalizedPage<NormalizedSchool> {
  const contents = xmlContents(data, 'schools');
  const items = contents
    .map((rec) => {
      const seq = cleanString(pick(rec, 'seq', 'schoolSeq', 'sch_code'));
      const name = cleanString(pick(rec, 'schoolName', 'school_nm', 'name'));
      if (seq === null || name === null) {
        warnAnomaly('schools', 'missing seq/name', rec);
        return null;
      }
      return {
        seq,
        name,
        region: cleanString(pick(rec, 'region', 'adres', 'address')),
        gubun: cleanString(pick(rec, 'schoolGubun', 'gubun')),
        estType: cleanString(pick(rec, 'estType', 'fond_sc_nm')),
        link: cleanString(pick(rec, 'link', 'hmpg_adres', 'url')),
        raw: rec,
      } satisfies NormalizedSchool;
    })
    .filter((s): s is NormalizedSchool => s !== null);
  return { items, total: xmlTotal(data) };
}

// ─── 진로상담사례 (EUC-KR XML: svcCode=COUNSEL / COUNSEL_VIEW) ───
// 실 API 구조: COUNSEL 목록 = 질문 코드표 {code, memo, gubun}, 본문은 COUNSEL_VIEW?con_cd=<code>의
// {question, answer} (<answer>에 &lt;/br&gt; 섞임). code('C82')는 문자+숫자라 안정적 숫자 seq로 변환한다.

export function counselCodeToSeq(code: string): number | null {
  const m = /^([A-Za-z])0*(\d+)$/.exec(code.trim());
  if (!m) return null;
  return (m[1]!.toUpperCase().charCodeAt(0) - 64) * 100_000 + Number(m[2]);
}

export function normalizeCounselCases(data: unknown): NormalizedPage<NormalizedCounselCase> {
  const contents = xmlContents(data, 'counsel');
  const items = contents
    .map((rec) => {
      // 실 API 목록 형태: code/memo. (구형/상세 형태: seq/title/question/answer도 허용)
      const code = cleanString(pick(rec, 'code', 'con_cd'));
      const seq = cleanNumber(pick(rec, 'seq', 'counselSeq')) ?? (code ? counselCodeToSeq(code) : null);
      const title = cleanString(pick(rec, 'title', 'subject', 'memo'));
      if (seq === null || title === null) {
        warnAnomaly('counsel', 'missing seq/title', rec);
        return null;
      }
      return {
        seq,
        title,
        question: cleanString(pick(rec, 'question', 'content')),
        answer: cleanString(pick(rec, 'answer', 'reply')),
        raw: rec,
      } satisfies NormalizedCounselCase;
    })
    .filter((c): c is NormalizedCounselCase => c !== null);
  return { items, total: xmlTotal(data) };
}

/** COUNSEL_VIEW?con_cd= 상세 — {question, answer} */
export function normalizeCounselDetail(data: unknown): { question: string | null; answer: string | null } | null {
  const contents = xmlContents(data, 'counsel-view');
  const rec = contents[0];
  if (!rec) return null;
  return {
    question: cleanString(pick(rec, 'question', 'content', 'memo')),
    answer: cleanString(pick(rec, 'answer', 'reply')),
  };
}

// ─── 진로교육자료 (EUC-KR XML: svcCode=COSE) — <attFile> 쉼표 다중 ───

export function normalizeEduMaterials(data: unknown): NormalizedPage<NormalizedEduMaterial> {
  const contents = xmlContents(data, 'cose');
  const items = contents
    .map((rec) => {
      const seq = cleanNumber(pick(rec, 'seq', 'coseSeq'));
      // 실 API 필드: dataTitle, attFile(쉼표 다중 URL), activityType, author
      const title = cleanString(pick(rec, 'title', 'subject', 'dataTitle'));
      if (seq === null || title === null) {
        warnAnomaly('cose', 'missing seq/title', rec);
        return null;
      }
      return {
        seq,
        title,
        summary: cleanString(pick(rec, 'summary', 'content', 'intro', 'activityType')),
        attFiles: splitList(pick(rec, 'attFile', 'attFiles', 'fileUrl'), ','),
        raw: rec,
      } satisfies NormalizedEduMaterial;
    })
    .filter((c): c is NormalizedEduMaterial => c !== null);
  return { items, total: xmlTotal(data) };
}

// ─── 심리검사 목록 (JSON: /inspct/openapi/v2/tests) ───

export function normalizeTests(data: unknown): NormalizedTest[] {
  const root = asRecord(data, 'tests');
  if (!root) return [];
  const arr = ensureArray((pick(root, 'result', 'tests', 'list') ?? []) as Record<string, unknown> | Record<string, unknown>[]);
  return arr
    .map((r) => asRecord(r, 'tests'))
    .filter((r): r is Record<string, unknown> => r !== null)
    .map((rec) => {
      const no = cleanNumber(pick(rec, 'q', 'qno', 'no', 'testNo', 'qestrnSeq'));
      const name = cleanString(pick(rec, 'name', 'qestrnNm', 'testName', 'title'));
      if (no === null || name === null) {
        warnAnomaly('tests', 'missing no/name', rec);
        return null;
      }
      return { no, name, target: cleanString(pick(rec, 'target', 'trgetNm')) } satisfies NormalizedTest;
    })
    .filter((t): t is NormalizedTest => t !== null);
}
