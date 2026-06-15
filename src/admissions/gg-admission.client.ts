import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString } from '../career/sanitize';

// 경기데이터드림 신입생충원(Ncmstus) + 전형유형별선발(Enschscritypeselectn) JSON.
// 경기 소재 대학 외에도 전국 일부 데이터 포함 — 학교명으로 매칭한다.

interface GgEnvelope { [k: string]: unknown }

async function fetchPage(serviceUrl: string, key: string, pIndex: number, pSize: number): Promise<{ rows: Record<string, unknown>[]; total: number }> {
  const url = new URL(serviceUrl);
  url.searchParams.set('Key', key);
  url.searchParams.set('Type', 'json');
  url.searchParams.set('pIndex', String(pIndex));
  url.searchParams.set('pSize', String(pSize));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const text = await res.text();
    const json = JSON.parse(text) as GgEnvelope;
    const wrapper = Object.values(json)[0] as unknown[];
    if (!Array.isArray(wrapper)) return { rows: [], total: 0 };
    const head = (wrapper[0] as Record<string, unknown>)?.['head'] as Array<Record<string, unknown>> | undefined;
    const total = Number((head?.find((h) => 'list_total_count' in h)?.['list_total_count'] as number) ?? 0);
    const rowWrap = wrapper.find((e) => (e as Record<string, unknown>)['row']) as Record<string, unknown> | undefined;
    return { rows: (rowWrap?.['row'] as Record<string, unknown>[]) ?? [], total };
  } finally {
    clearTimeout(timer);
  }
}

export interface FreshmanFill {
  svyYr: number;
  schoolName: string;
  capacity: number | null; // 입학정원
  recruited: number | null; // 모집인원합계
  applicants: number | null; // 지원자합계
  enrolled: number | null; // 입학자합계
  fillRate: number | null; // 정원내신입생충원율
  competition: number | null; // 경쟁비율
}

export interface SelectionRow {
  svyYr: number;
  schoolName: string;
  capacityType: string | null; // 정원내/정원외
  type: string | null; // 전형유형명
  largeClass: string | null;
  recruitTotal: number | null; // 최종모집인원
  registered: number | null; // 최종등록인원
  registrationRate: number | null; // 최종등록비율
}

export class GgAdmissionClient {
  get enabled(): boolean { return env().GG_DATA_API_KEY !== ''; }

  async fetchFreshmanFill(maxPages = 20): Promise<FreshmanFill[]> {
    const out: FreshmanFill[] = [];
    let total = Infinity;
    for (let p = 1; p <= maxPages && (p - 1) * 1000 < total; p++) {
      const { rows, total: t } = await fetchPage('https://openapi.gg.go.kr/Ncmstus', env().GG_DATA_API_KEY, p, 1000);
      total = t || total;
      if (!rows.length) break;
      for (const r of rows) {
        const svyYr = Number(cleanString(r['STD_YY']));
        const name = cleanString(r['SCHOOL_NM']);
        if (!Number.isFinite(svyYr) || !name) continue;
        out.push({
          svyYr,
          schoolName: name.replace(/\s*_제?\d?캠퍼스$/, '').trim(),
          capacity: Number(cleanString(r['ENSCH_PSN_CAPA'])) || null,
          recruited: Number(cleanString(r['RECRUT_PSN_CNT_SUM'])) || null,
          applicants: Number(cleanString(r['APLCT_SUM'])) || null,
          enrolled: Number(cleanString(r['NSTD_SUM'])) || null,
          fillRate: Number(cleanString(r['PSN_CAPA_ISE_FRMAN_RCRT_RT'])) || null,
          competition: Number(cleanString(r['COMPT_RT'])) || null,
        });
      }
      await new Promise((r) => setTimeout(r, 20));
    }
    return out;
  }

  /** 전형유형별 — 데이터가 11,924건이라 학교별 요약(타입별 등록률 평균)으로 축약. */
  async fetchSelectionByType(maxPages = 20): Promise<SelectionRow[]> {
    const out: SelectionRow[] = [];
    let total = Infinity;
    for (let p = 1; p <= maxPages && (p - 1) * 1000 < total; p++) {
      const { rows, total: t } = await fetchPage('https://openapi.gg.go.kr/Enschscritypeselectn', env().GG_DATA_API_KEY, p, 1000);
      total = t || total;
      if (!rows.length) break;
      for (const r of rows) {
        const svyYr = Number(cleanString(r['STD_YY']));
        const name = cleanString(r['SCHOOL_NM']);
        if (!Number.isFinite(svyYr) || !name) continue;
        out.push({
          svyYr,
          schoolName: name,
          capacityType: cleanString(r['PSN_CAPA_DIV_NM']),
          type: cleanString(r['SCRI_TYPE_NM']),
          largeClass: cleanString(r['SCRI_LRGE_CLASS_NM']),
          recruitTotal: Number(cleanString(r['LAST_RECRUT_PSN_CNT'])) || null,
          registered: Number(cleanString(r['LAST_REGIST_PSN_CNT'])) || null,
          registrationRate: Number(cleanString(r['LAST_REGIST_RT'])) || null,
        });
      }
      await new Promise((r) => setTimeout(r, 20));
    }
    return out;
  }
}
