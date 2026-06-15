import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString } from '../career/sanitize';
import type { DeptRow } from './dept-csv';

// 경기데이터드림 "대학별 학과정보 현황" API (openapi.gg.go.kr/Univmjrm, JSON).
// CSV importer와 같은 UniversityDepartment를 채우되, API라서 연도별 자동 갱신이 가능하다.
// 응답 envelope: { Univmjrm: [ { head: [{list_total_count}, {RESULT:{CODE,MESSAGE}}] }, { row: [...] } ] }

interface GgRow {
  EXAMIN_YY?: string;
  SCHOOL_NM?: string;
  THSCHOL_BRSCHOL_NM?: string;
  COLGE_UNIV_NM?: string;
  UNDSTUD_KWA_NM?: string;
  DAN_DIV_NM?: string;
  MJR_CHARTR_NM?: string;
  MJR_STATE_NM?: string;
  LRGE_AFIL_NM?: string;
  MED_AFIL_NM?: string;
  SM_AFIL_NM?: string;
  CLAS_TERM_NM?: string;
  DEG_CRSE_NM?: string;
}

function ggRowToDept(r: GgRow): DeptRow | null {
  const svyYr = Number(cleanString(r.EXAMIN_YY));
  const schoolName = cleanString(r.SCHOOL_NM);
  const name = cleanString(r.UNDSTUD_KWA_NM);
  const status = cleanString(r.MJR_STATE_NM);
  if (!Number.isFinite(svyYr) || svyYr < 1900 || !schoolName || !name || !status) return null;
  return {
    svyYr,
    schoolName,
    campus: cleanString(r.THSCHOL_BRSCHOL_NM),
    college: cleanString(r.COLGE_UNIV_NM),
    name,
    dayNight: cleanString(r.DAN_DIV_NM),
    feature: cleanString(r.MJR_CHARTR_NM),
    status,
    active: !status.includes('폐'), // 폐과/폐지 모두 비활성
    seriesLarge: cleanString(r.LRGE_AFIL_NM),
    seriesMid: cleanString(r.MED_AFIL_NM),
    seriesSmall: cleanString(r.SM_AFIL_NM),
    degree: cleanString(r.DEG_CRSE_NM),
    years: cleanString(r.CLAS_TERM_NM),
  };
}

/** 단위테스트 전용 export */
export const __ggTest = { ggRowToDept };

export class DeptApiClient {
  get enabled(): boolean {
    return env().GG_DATA_API_KEY !== '';
  }

  private async fetchPage(pIndex: number, pSize: number): Promise<{ rows: GgRow[]; total: number }> {
    const url = new URL(env().GG_DATA_BASE_URL);
    url.searchParams.set('Key', env().GG_DATA_API_KEY);
    url.searchParams.set('Type', 'json');
    url.searchParams.set('pIndex', String(pIndex));
    url.searchParams.set('pSize', String(pSize));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      const text = await res.text();
      const json = JSON.parse(text) as Record<string, unknown>;
      const env0 = json['Univmjrm'] as unknown[] | undefined;
      if (!Array.isArray(env0)) {
        // 에러는 {RESULT:{CODE,MESSAGE}} 단일 형태로 옴
        const result = (json['RESULT'] ?? (json['Univmjrm'] as Record<string, unknown>)?.['RESULT']) as { CODE?: string; MESSAGE?: string } | undefined;
        throw new Error(`gg api: ${result?.CODE ?? 'unknown'} ${result?.MESSAGE ?? text.slice(0, 100)}`);
      }
      const head = (env0[0] as Record<string, unknown>)?.['head'] as Array<Record<string, unknown>> | undefined;
      const total = Number((head?.find((h) => 'list_total_count' in h)?.['list_total_count'] as number) ?? 0);
      const rowWrap = env0.find((e) => (e as Record<string, unknown>)['row']) as Record<string, unknown> | undefined;
      const rows = (rowWrap?.['row'] as GgRow[]) ?? [];
      return { rows, total };
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 전체 학과 정보를 페이지네이션으로 수집해 정규화.
   * onlyLatestYear=true면 최신 조사연도 데이터만 반환(현존 학과 화면용).
   */
  async fetchAll(opts: { onlyLatestYear?: boolean; maxPages?: number } = {}): Promise<{ rows: DeptRow[]; svyYr: number | null }> {
    const pSize = 1000;
    const all: DeptRow[] = [];
    let total = Infinity;
    const maxPages = opts.maxPages ?? 100;
    for (let pIndex = 1; pIndex <= maxPages && (pIndex - 1) * pSize < total; pIndex++) {
      const { rows, total: t } = await this.fetchPage(pIndex, pSize);
      total = t || total;
      if (!rows.length) break;
      for (const r of rows) {
        const dept = ggRowToDept(r);
        if (dept) all.push(dept);
      }
      await new Promise((res) => setTimeout(res, 20)); // 예의상 페이싱
    }
    if (all.length === 0) return { rows: [], svyYr: null };
    const latestYear = Math.max(...all.map((d) => d.svyYr));
    logger.info({ collected: all.length, latestYear, total }, 'dept api fetched');
    if (opts.onlyLatestYear) {
      return { rows: all.filter((d) => d.svyYr === latestYear), svyYr: latestYear };
    }
    return { rows: all, svyYr: latestYear };
  }
}
