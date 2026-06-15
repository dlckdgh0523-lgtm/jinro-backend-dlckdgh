import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString } from '../career/sanitize';

// 한국국제교류재단 해외대학 표준국문명칭 (B260004/OverseaUnivKornameService2).
// 학생이 "해외대학 이름" 검색 시 국문↔영문↔현지어를 매칭. 차기 College Scorecard 등과 결합 기반.

export interface ForeignUniv {
  id: string; // univ_cd
  nameKo: string; // univ_nm
  nameEn: string | null; // univ_eng_nm
  nameLocal: string | null; // univ_loc_nm
  countryKo: string | null;
  countryEn: string | null;
  countryIso2: string | null;
  raw: Record<string, unknown>;
}

export class OverseaUnivClient {
  get enabled(): boolean { return env().DATA_GO_KR_API_KEY !== ''; }

  private async page(pageNo: number, numOfRows: number, countryIso2?: string): Promise<{ items: ForeignUniv[]; total: number }> {
    const url = new URL(`${env().OVERSEA_UNIV_BASE_URL}/getKornameList2`);
    url.searchParams.set('serviceKey', env().DATA_GO_KR_API_KEY);
    url.searchParams.set('pageNo', String(pageNo));
    url.searchParams.set('numOfRows', String(numOfRows));
    url.searchParams.set('returnType', 'JSON');
    if (countryIso2) url.searchParams.set('cond[country_iso_alp2::EQ]', countryIso2);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15_000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (res.status >= 400) throw new Error(`oversea http ${res.status}`);
      const text = await res.text();
      const json = JSON.parse(text) as Record<string, unknown>;
      const response = json['response'] as Record<string, unknown> | undefined;
      const body = response?.['body'] as Record<string, unknown> | undefined;
      const total = Number(body?.['totalCount'] ?? 0);
      const itemsObj = body?.['items'] as Record<string, unknown> | undefined;
      const rawItems = Array.isArray(itemsObj?.['item']) ? itemsObj?.['item'] : itemsObj?.['item'] ? [itemsObj['item']] : [];
      const items = (rawItems as Record<string, unknown>[])
        .map((r) => {
          const id = cleanString(r['univ_cd']);
          const nameKo = cleanString(r['univ_nm']);
          if (!id || !nameKo) return null;
          return {
            id,
            nameKo,
            nameEn: cleanString(r['univ_eng_nm']),
            nameLocal: cleanString(r['univ_loc_nm']),
            countryKo: cleanString(r['country_nm']),
            countryEn: cleanString(r['country_eng_nm']),
            countryIso2: cleanString(r['country_iso_alp2']),
            raw: r,
          } satisfies ForeignUniv;
        })
        .filter((v): v is ForeignUniv => v !== null);
      return { items, total };
    } finally {
      clearTimeout(timer);
    }
  }

  /** 전체(또는 특정 국가) 수집 — 페이지네이션. */
  async fetchAll(opts: { countryIso2?: string; maxPages?: number } = {}): Promise<ForeignUniv[]> {
    const out: ForeignUniv[] = [];
    let total = Infinity;
    const max = opts.maxPages ?? 50;
    for (let p = 1; p <= max && (p - 1) * 200 < total; p++) {
      const { items, total: t } = await this.page(p, 200, opts.countryIso2);
      total = t || total;
      if (!items.length) break;
      out.push(...items);
      await new Promise((r) => setTimeout(r, 30));
    }
    return out;
  }
}
