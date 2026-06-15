import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString } from '../career/sanitize';

// 경기데이터드림 외국대학과의 교류현황 (Fgcutunivstus) — 학교별 파견·유치 인원.
// 대학 상세 "국제화" 지표로 노출 + AI상담에서 해외 진학 관심 학생에게 추천 시 참고.

export interface ExchangeRow {
  svyYr: number;
  schoolName: string;
  schoolKind: string | null;
  foundDiv: string | null;
  dispatched: number; // 자대학 → 타대학 파견인원수
  invited: number;    // 타대학 → 자대학 유치인원수
}

export class ExchangeClient {
  get enabled(): boolean { return env().GG_DATA_API_KEY !== ''; }

  async fetchAll(maxPages = 20): Promise<ExchangeRow[]> {
    const out: ExchangeRow[] = [];
    let total = Infinity;
    for (let p = 1; p <= maxPages && (p - 1) * 1000 < total; p++) {
      const url = new URL('https://openapi.gg.go.kr/Fgcutunivstus');
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
          out.push({
            svyYr,
            schoolName,
            schoolKind: cleanString(r['SCHOOL_KIND_NM']),
            foundDiv: cleanString(r['FOUND_DIV_NM']),
            dispatched: Number(cleanString(r['DISPTC_PSN_CNT'])) || 0,
            invited: Number(cleanString(r['CONFNMT_PSN_CNT'])) || 0,
          });
        }
        await new Promise(r => setTimeout(r, 30));
      } catch (e) {
        logger.warn({ err: (e as Error).message, page: p }, 'exchange fetch failed');
        break;
      }
    }
    logger.info({ collected: out.length, total }, 'exchange fetched');
    return out;
  }
}
