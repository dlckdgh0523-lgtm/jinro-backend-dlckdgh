import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString } from '../career/sanitize';

// 한국장학재단 학자금지원정보(대학생) — 공공데이터포털 파일데이터의 odcloud 자동변환 OpenAPI.
// 데이터셋: https://www.data.go.kr/data/15028252/fileData.do (월간 갱신, 약 1,850건)
//
// 파일데이터라 요청 URL에 파일 버전별 uddi가 들어가고 월마다 바뀔 수 있어, 엔드포인트를
// env(KOSAF_SCHOLARSHIP_API_URL)로 주입한다. 인증키는 공용 DATA_GO_KR_API_KEY(serviceKey)를 재사용.
//   예) KOSAF_SCHOLARSHIP_API_URL="https://api.odcloud.kr/api/15028252/v1/uddi:xxxxxxxx-xxxx-..."
// odcloud 응답: { page, perPage, totalCount, currentCount, data: [ { 한글컬럼: 값, ... } ] }

export interface ScholarshipRow {
  organization: string | null;
  productName: string;
  productType: string | null;
  supportType: string | null;
  target: string | null;
  applyPeriod: string | null;
  amount: string | null;
  selectCount: string | null;
  raw: Record<string, unknown>;
}

export class ScholarshipClient {
  get enabled(): boolean {
    return env().KOSAF_SCHOLARSHIP_API_URL !== '';
  }

  async fetchAll(maxPages = 30, perPage = 500): Promise<ScholarshipRow[]> {
    const out: ScholarshipRow[] = [];
    let total = Infinity;
    for (let page = 1; page <= maxPages && (page - 1) * perPage < total; page++) {
      const url = new URL(env().KOSAF_SCHOLARSHIP_API_URL);
      url.searchParams.set('page', String(page));
      url.searchParams.set('perPage', String(perPage));
      // serviceKey가 URL에 이미 박혀 있으면 그대로 사용, 없을 때만 공용 키로 보강.
      if (!url.searchParams.has('serviceKey') && env().DATA_GO_KR_API_KEY) {
        url.searchParams.set('serviceKey', env().DATA_GO_KR_API_KEY);
      }
      try {
        const res = await fetch(url);
        if (res.status >= 400) {
          logger.warn({ status: res.status, page }, 'scholarship fetch http error');
          break;
        }
        const json = (await res.json()) as { data?: Record<string, unknown>[]; totalCount?: number };
        total = Number(json.totalCount ?? total);
        const rows = json.data ?? [];
        if (!Array.isArray(rows) || rows.length === 0) break;
        for (const r of rows) {
          // 컬럼명이 갱신마다 약간 달라질 수 있어 후보 키를 순서대로 시도.
          const pick = (...keys: string[]): string | null => {
            for (const k of keys) {
              const v = cleanString(r[k]);
              if (v) return v;
            }
            return null;
          };
          const productName = pick('상품명', '학자금상품명', '장학금명');
          if (!productName) continue;
          const target = [pick('대학구분'), pick('학년구분'), pick('학과구분')].filter(Boolean).join(' / ') || null;
          const applyPeriod = [pick('모집시작일', '신청시작일'), pick('모집종료일', '신청종료일')].filter(Boolean).join(' ~ ') || null;
          out.push({
            organization: pick('운영기관명', '운영기관'),
            productName,
            productType: pick('상품구분', '운영기관구분'),
            supportType: pick('학자금유형구분', '지원유형'),
            target,
            applyPeriod,
            amount: pick('지원내역 상세내용', '지원내역상세내용', '지원금액'),
            selectCount: pick('선발인원 상세내용', '선발인원상세내용', '선발인원'),
            raw: r,
          });
        }
        await new Promise((r) => setTimeout(r, 40)); // 페이싱
      } catch (e) {
        logger.warn({ err: (e as Error).message, page }, 'scholarship fetch failed');
        break;
      }
    }
    logger.info({ collected: out.length, total }, 'scholarship fetched');
    return out;
  }
}
