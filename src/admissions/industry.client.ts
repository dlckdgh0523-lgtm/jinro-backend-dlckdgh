import { XMLParser } from 'fast-xml-parser';
import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString, ensureArray } from '../career/sanitize';

// 대학알리미 산학협력 현황 API (B340014/IndustryAcademicCooperationService).
// 같은 indctVal* 패턴이지만 영역이 많아 운영 시 필드명이 가변적이라 raw 전체를 보존.
// 핵심 7개 오퍼레이션:
//  - getGrndsPrcOperCstt: 현장실습
//  - getCsptDsgnOperCstt: 캡스톤디자인
//  - getCntrctmjrInstOperCstt: 계약학과
//  - getOrdmthEdcCrseInstOper: 주문식교육과정
//  - getStdnStupSuptCstt: 학생창업
//  - getTcherStupSuptCstt: 교원창업
//  - getStupEdcSuptCstt: 창업교육

const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, trimValues: true });

export type IndustryOp =
  | 'getGrndsPrcOperCstt'
  | 'getCsptDsgnOperCstt'
  | 'getCntrctmjrInstOperCstt'
  | 'getOrdmthEdcCrseInstOper'
  | 'getStdnStupSuptCstt'
  | 'getTcherStupSuptCstt'
  | 'getStupEdcSuptCstt';

export interface IndustryItem {
  raw: Record<string, unknown>;
}

export class IndustryClient {
  get enabled(): boolean {
    return env().DATA_GO_KR_API_KEY !== '';
  }

  /** 학교+공시연도 단위로 산학협력 한 영역 조회. 빈 값/에러는 [] 반환 (보조 데이터). */
  async fetchOne(op: IndustryOp, svyYr: number, schlId: string): Promise<IndustryItem[]> {
    const url = new URL(`${env().ALIMI_INDUSTRY_BASE_URL}/${op}`);
    url.searchParams.set('serviceKey', env().DATA_GO_KR_API_KEY);
    url.searchParams.set('svyYr', String(svyYr));
    url.searchParams.set('schlId', schlId);
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('numOfRows', '50');
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 15_000);
      let text: string;
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (res.status >= 400) return [];
        text = await res.text();
      } finally {
        clearTimeout(timer);
      }
      const root = parser.parse(text) as Record<string, unknown>;
      const response = root['response'] as Record<string, unknown> | undefined;
      const header = response?.['header'] as Record<string, unknown> | undefined;
      if (String(header?.['resultCode'] ?? '') !== '00') return [];
      const body = response?.['body'] as Record<string, unknown> | undefined;
      const items = ensureArray((body?.['items'] as Record<string, unknown> | undefined)?.['item'] as Record<string, unknown> | Record<string, unknown>[] | undefined);
      return items.map((r) => ({ raw: r }));
    } catch (e) {
      logger.warn({ op, schlId, err: (e as Error).message }, 'industry api skipped');
      return [];
    }
  }

  /** 학교별 요약 — 영역별 행 카운트로 단순화(필드명 가변성 흡수). */
  async universitySummary(svyYr: number, schlId: string): Promise<Record<string, number>> {
    const ops: IndustryOp[] = ['getGrndsPrcOperCstt', 'getCsptDsgnOperCstt', 'getCntrctmjrInstOperCstt', 'getStdnStupSuptCstt'];
    const out: Record<string, number> = {};
    for (const op of ops) {
      const items = await this.fetchOne(op, svyYr, schlId);
      out[op] = items.length;
      await new Promise((r) => setTimeout(r, 30)); // 페이싱
    }
    return out;
  }
}
