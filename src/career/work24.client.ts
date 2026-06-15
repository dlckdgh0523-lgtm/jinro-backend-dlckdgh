import { XMLParser } from 'fast-xml-parser';
import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString, ensureArray } from './sanitize';

// 워크넷(work24.go.kr / 고용노동부) 오픈 API — 키가 서비스별로 다르다.
// - 직업정보(212): WORK24_JOB_KEY
// - 학과정보(213): WORK24_MAJOR_KEY
// - 직무기술서(215): WORK24_DUTY_KEY
// - 공통코드(21): WORK24_CMCD_KEY
// 모두 XML 응답. 커리어넷과 보완 관계 (커리어넷=직업·전공 백과, 워크넷=고용 통계·NCS·기업).

const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, trimValues: true });

async function fetchXml(url: URL): Promise<Record<string, unknown>> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (res.status >= 400) throw new Error(`work24 http ${res.status}`);
    const text = await res.text();
    return parser.parse(text) as Record<string, unknown>;
  } finally {
    clearTimeout(timer);
  }
}

export interface Work24Job {
  jobCd: string;
  jobNm: string;
  jobClcd: string | null;
  jobClcdNM: string | null;
}

export interface Work24Major {
  majorGb: '1' | '2' | null; // 1=일반학과 2=이색학과
  knowSchDptNm: string;
  knowDtlSchDptNm: string | null;
  empCurtState1Id: string | null;
  empCurtState2Id: string | null;
}

export class Work24Client {
  /** 직업정보(212). 키워드/조건 검색. 키 없으면 [] */
  async searchJobs(opts: { keyword?: string; avgSal?: '10' | '20' | '30' | '40'; prospect?: '1' | '2' | '3' | '4' | '5' } = {}): Promise<Work24Job[]> {
    if (!env().WORK24_JOB_KEY) return [];
    const url = new URL(`${env().WORK24_BASE_URL}/callOpenApiSvcInfo212L01.do`);
    url.searchParams.set('authKey', env().WORK24_JOB_KEY);
    url.searchParams.set('returnType', 'XML');
    url.searchParams.set('target', 'JOBCD');
    if (opts.keyword) {
      url.searchParams.set('srchType', 'K');
      url.searchParams.set('keyword', opts.keyword);
    } else if (opts.avgSal || opts.prospect) {
      url.searchParams.set('srchType', 'C');
      if (opts.avgSal) url.searchParams.set('avgSal', opts.avgSal);
      if (opts.prospect) url.searchParams.set('prospect', opts.prospect);
    }
    try {
      const root = await fetchXml(url);
      const list = (root['jobsList'] as Record<string, unknown> | undefined)?.['jobList'];
      return ensureArray(list as Record<string, unknown> | Record<string, unknown>[] | undefined)
        .map((r) => {
          const jobCd = cleanString(r['jobCd']);
          const jobNm = cleanString(r['jobNm']);
          if (!jobCd || !jobNm) return null;
          return {
            jobCd,
            jobNm,
            jobClcd: cleanString(r['jobClcd']),
            jobClcdNM: cleanString(r['jobClcdNM']),
          } satisfies Work24Job;
        })
        .filter((v): v is Work24Job => v !== null);
    } catch (e) {
      logger.warn({ err: (e as Error).message }, 'work24 jobs failed');
      return [];
    }
  }

  /** 학과정보(213). 키워드 검색. */
  async searchMajors(keyword: string): Promise<Work24Major[]> {
    if (!env().WORK24_MAJOR_KEY || !keyword) return [];
    const url = new URL(`${env().WORK24_BASE_URL}/callOpenApiSvcInfo213L01.do`);
    url.searchParams.set('authKey', env().WORK24_MAJOR_KEY);
    url.searchParams.set('returnType', 'XML');
    url.searchParams.set('target', 'MAJORCD');
    url.searchParams.set('srchType', 'K');
    url.searchParams.set('keyword', keyword);
    try {
      const root = await fetchXml(url);
      const list = (root['majorsList'] as Record<string, unknown> | undefined)?.['majorList'];
      return ensureArray(list as Record<string, unknown> | Record<string, unknown>[] | undefined)
        .map((r) => {
          const knowSchDptNm = cleanString(r['knowSchDptNm']);
          if (!knowSchDptNm) return null;
          const gb = cleanString(r['majorGb']);
          return {
            majorGb: gb === '1' || gb === '2' ? gb : null,
            knowSchDptNm,
            knowDtlSchDptNm: cleanString(r['knowDtlSchDptNm']),
            empCurtState1Id: cleanString(r['empCurtState1Id']),
            empCurtState2Id: cleanString(r['empCurtState2Id']),
          } satisfies Work24Major;
        })
        .filter((v): v is Work24Major => v !== null);
    } catch (e) {
      logger.warn({ err: (e as Error).message }, 'work24 majors failed');
      return [];
    }
  }

  /** 표준직무기술서(215). 수행직무 내용 → NCS 능력단위 추천. */
  async getDutyDescription(jobCont: string, limit = 5): Promise<Record<string, unknown> | null> {
    if (!env().WORK24_DUTY_KEY || !jobCont) return null;
    const url = new URL(`${env().WORK24_BASE_URL}/callOpenApiSvcInfo215L01.do`);
    url.searchParams.set('authKey', env().WORK24_DUTY_KEY);
    url.searchParams.set('jobCont', jobCont);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('returnType', 'JSON');
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20_000);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (res.status >= 400) return null;
        const text = await res.text();
        return JSON.parse(text) as Record<string, unknown>;
      } finally {
        clearTimeout(timer);
      }
    } catch (e) {
      logger.warn({ err: (e as Error).message }, 'work24 duty failed');
      return null;
    }
  }

  /** 공통코드(21). dtlGb: 1=지역 2=직종 3=자격 6=전공 등 */
  async getCommonCode(dtlGb: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'): Promise<Record<string, unknown> | null> {
    if (!env().WORK24_CMCD_KEY) return null;
    const url = new URL(`${env().WORK24_BASE_URL}/callOpenApiSvcInfo21L01.do`);
    url.searchParams.set('authKey', env().WORK24_CMCD_KEY);
    url.searchParams.set('returnType', 'XML');
    url.searchParams.set('target', 'CMCD');
    url.searchParams.set('dtlGb', dtlGb);
    try {
      const root = await fetchXml(url);
      return root;
    } catch (e) {
      logger.warn({ err: (e as Error).message, dtlGb }, 'work24 cmcd failed');
      return null;
    }
  }
}
