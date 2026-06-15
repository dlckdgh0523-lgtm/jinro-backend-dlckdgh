import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString } from '../career/sanitize';

// 경기데이터드림 졸업생 취업현황 (Grduemplymtuniv) — 학교+학과+성별 취업률.
// 사용자 부탁: 학과 상세에 노출. 학생부 진로 결정에 가장 강력한 지표.

export interface EmploymentRow {
  svyYr: number;
  schoolName: string;
  college: string | null;
  majorName: string | null;
  div: string | null;
  graduates: number; // 남+여 졸업자
  employed: number; // 건강보험+해외+영농+창작+창업+프리랜서 합산
  employmentRate: number | null; // EMPLYMT_RT %
  primaryMaintain: number | null; // 1차 유지율
}

export class EmploymentClient {
  get enabled(): boolean { return env().GG_DATA_API_KEY !== ''; }

  async fetchAll(maxPages = 20): Promise<EmploymentRow[]> {
    const out: EmploymentRow[] = [];
    let total = Infinity;
    for (let p = 1; p <= maxPages && (p - 1) * 1000 < total; p++) {
      const url = new URL('https://openapi.gg.go.kr/Grduemplymtuniv');
      url.searchParams.set('Key', env().GG_DATA_API_KEY);
      url.searchParams.set('Type', 'json');
      url.searchParams.set('pIndex', String(p));
      url.searchParams.set('pSize', '1000');
      try {
        const res = await fetch(url);
        if (res.status >= 400) break;
        const json = await res.json() as Record<string, unknown>;
        const wrap = (Object.values(json)[0] as unknown[]) ?? [];
        if (!Array.isArray(wrap)) break;
        const head = (wrap[0] as Record<string, unknown>)?.['head'] as Array<Record<string, unknown>> | undefined;
        total = Number((head?.find(h => 'list_total_count' in h)?.['list_total_count'] as number) ?? total);
        const rows = ((wrap.find(e => (e as Record<string, unknown>)['row']) as Record<string, unknown> | undefined)?.['row'] as Record<string, unknown>[] | undefined) ?? [];
        if (!rows.length) break;
        for (const r of rows) {
          const svyYr = Number(cleanString(r['STD_YY']));
          const schoolName = cleanString(r['SCHOOL_NM']);
          if (!Number.isFinite(svyYr) || !schoolName) continue;
          const num = (k: string) => Number(cleanString(r[k])) || 0;
          const graduates = num('MALE_GRA_CNT') + num('FEMALE_GRA_CNT');
          const employed =
            num('HTIR_CONCTN_MALE_EMPLYE_CNT') + num('HTIR_CONCTN_FEMALE_EMPLYE_CNT') +
            num('OVSEA_MALE_EMPLYE_CNT') + num('OVSEA_FEMALE_EMPLYE_CNT') +
            num('FARMJ_MALE_ENFLPSN_CNT') + num('FARMJ_FEMALE_ENFLPSN_CNT') +
            num('INDVDL_CRAT_MALE_ENFLPSN_CNT') + num('INDVDL_CRAT_FEMALE_ENFLPSN_CNT') +
            num('PSN1_MALE_FUDR_CNT') + num('PSN1_FEMALE_FUDR_CNT') +
            num('MALE_FRLAC_CNT') + num('FEMALE_FRLAC_CNT');
          out.push({
            svyYr,
            schoolName,
            college: cleanString(r['COLGE_UNIV_NM']),
            majorName: cleanString(r['MJR_NM']),
            div: cleanString(r['DIV_NM']),
            graduates,
            employed,
            employmentRate: Number(cleanString(r['EMPLYMT_RT'])) || null,
            primaryMaintain: Number(cleanString(r['PRMRY_MAINTNC_SUM_EMPRT'])) || null,
          });
        }
        await new Promise(r => setTimeout(r, 30));
      } catch (e) {
        logger.warn({ err: (e as Error).message, page: p }, 'employment fetch failed');
        break;
      }
    }
    logger.info({ collected: out.length, total }, 'employment fetched');
    return out;
  }
}
