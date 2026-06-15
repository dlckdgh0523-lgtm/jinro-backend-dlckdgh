import { XMLParser } from 'fast-xml-parser';
import pRetry from 'p-retry';
import { env } from '../common/env';
import { AppError, ErrorCode } from '../common/errors';
import { logger } from '../common/logger';
import { cleanString, ensureArray } from '../career/sanitize';

// 대학알리미 기본정보 API (공공데이터포털 B340014/BasicInformationService_2, UTF-8 XML).
// 2026-06 실키 검증 필드: schlId(공시ID), schlKrnNm(대학명), schlFullNm, clgcpDivNm(캠퍼스),
// estbDivNm(설립), schlDivNm(대학/전문대학), schlKndNm(종류), znNm(지역), svyYr.
// 응답 래퍼: response.header.resultCode('00'=정상) + body.items.item[] (단일→배열 정규화)

export interface AlimiUniversity {
  schlId: string;
  name: string; // schlKrnNm
  fullName: string | null;
  campus: string | null;
  estType: string | null; // 설립 (국립/사립/...)
  schlDiv: string | null; // 대학/전문대학
  schlKnd: string | null; // 대학교/대학원대학 등
  region: string | null;
  svyYr: number | null;
  raw: Record<string, unknown>;
}

const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, trimValues: true });

export class AlimiClient {
  get enabled(): boolean {
    return env().DATA_GO_KR_API_KEY !== '';
  }

  private async get(op: string, params: Record<string, string | number>): Promise<Record<string, unknown>[]> {
    const url = new URL(`${env().ALIMI_BASE_URL.replace(/\/$/, '')}/${op}`);
    url.searchParams.set('serviceKey', env().DATA_GO_KR_API_KEY);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

    return pRetry(
      async () => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), env().ALIMI_TIMEOUT_MS);
        let text: string;
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (res.status >= 400) throw new Error(`alimi http ${res.status}`);
          text = await res.text(); // data.go.kr 게이트웨이는 UTF-8 — euc-kr 아님
        } finally {
          clearTimeout(timer);
        }
        const root = parser.parse(text) as Record<string, unknown>;
        const response = root['response'] as Record<string, unknown> | undefined;
        const header = response?.['header'] as Record<string, unknown> | undefined;
        const code = String(header?.['resultCode'] ?? '');
        if (code !== '00') {
          throw new Error(`alimi resultCode ${code}: ${String(header?.['resultMsg'] ?? '')}`);
        }
        const body = response?.['body'] as Record<string, unknown> | undefined;
        const items = (body?.['items'] as Record<string, unknown> | undefined)?.['item'];
        return ensureArray(items as Record<string, unknown> | Record<string, unknown>[] | undefined);
      },
      { retries: 2, minTimeout: 500, maxTimeout: 2_000 },
    ).catch((e: Error) => {
      throw new AppError(ErrorCode.CAREERNET_UPSTREAM_ERROR, '대학 공시 정보 서버 오류가 발생했어요.', { cause: e });
    });
  }

  /** 최신 공시연도 */
  async latestPubYear(): Promise<number | null> {
    const items = await this.get('getComparisonPubYear', { pageNo: 1, numOfRows: 1 });
    const y = Number(cleanString(items[0]?.['yearVal']));
    return Number.isFinite(y) ? y : null;
  }

  /**
   * 입시통계(StudentService) — 학교아이디+공시년도 기준 지표.
   * 2026-06 검증: 응답 item의 indctVal1이 지표값(경쟁률/충원율/등록률 등), 공통 래퍼 동일.
   * 별도 서비스지만 같은 게이트웨이/키 → ALIMI_BASE_URL의 호스트만 바꿔 StudentService 경로 호출.
   */
  private studentBase(): string {
    // ALIMI_BASE_URL(.../BasicInformationService_2) → 같은 host의 /StudentService
    return env().ALIMI_BASE_URL.replace(/\/[^/]+$/, '/StudentService');
  }

  private async getStudentVal(op: string, svyYr: number, schlId: string): Promise<number | null> {
    const url = new URL(`${this.studentBase()}/${op}`);
    url.searchParams.set('serviceKey', env().DATA_GO_KR_API_KEY);
    url.searchParams.set('svyYr', String(svyYr));
    url.searchParams.set('schlId', schlId);
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('numOfRows', '1');
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), env().ALIMI_TIMEOUT_MS);
      let text: string;
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.status >= 400) return null; // 403(미승인 op)/5xx는 조용히 skip — 보조 데이터
        text = await res.text();
      } finally {
        clearTimeout(timer);
      }
      const root = parser.parse(text) as Record<string, unknown>;
      const item = ((((root['response'] as Record<string, unknown>)?.['body'] as Record<string, unknown>)?.['items'] as Record<string, unknown>)?.['item']) as Record<string, unknown> | Record<string, unknown>[] | undefined;
      const first = Array.isArray(item) ? item[0] : item;
      const v = Number(cleanString(first?.['indctVal1']));
      return Number.isFinite(v) ? v : null;
    } catch (e) {
      logger.warn({ op, schlId, err: (e as Error).message }, 'student stat fetch failed');
      return null;
    }
  }

  /** 대학 입시 핵심 지표(경쟁률·충원율·등록률) — schlId 기준 */
  async universityAdmissionStats(svyYr: number, schlId: string): Promise<{ competitionRate: number | null; freshmanFillRate: number | null; finalRegistrationRate: number | null }> {
    const [competitionRate, freshmanFillRate, finalRegistrationRate] = await Promise.all([
      this.getStudentVal('getComparisonInsideFixedNumberFreshmanCompetitionRate', svyYr, schlId),
      this.getStudentVal('getComparisonFreshmanEnsureCrntSt', svyYr, schlId),
      this.getStudentVal('getComparisonEntranceModelLastRegistrationRatio', svyYr, schlId),
    ]);
    return { competitionRate, freshmanFillRate, finalRegistrationRate };
  }

  /** 대학 검색목록 (대학비교통계) — 전국 ~377교, 한 페이지 수신 */
  async listUniversities(svyYr: number): Promise<AlimiUniversity[]> {
    const items = await this.get('getComparisonUniversitySearchList', { svyYr, pageNo: 1, numOfRows: 1000 });
    return items
      .map((rec) => {
        const schlId = cleanString(rec['schlId']);
        const name = cleanString(rec['schlKrnNm']);
        if (!schlId || !name) {
          logger.warn({ sample: JSON.stringify(rec).slice(0, 200) }, 'alimi anomaly: missing schlId/name');
          return null;
        }
        return {
          schlId,
          name,
          fullName: cleanString(rec['schlFullNm']),
          campus: cleanString(rec['clgcpDivNm']),
          estType: cleanString(rec['estbDivNm']),
          schlDiv: cleanString(rec['schlDivNm']),
          schlKnd: cleanString(rec['schlKndNm']),
          region: cleanString(rec['znNm']),
          svyYr: Number(cleanString(rec['svyYr'])) || null,
          raw: rec,
        } satisfies AlimiUniversity;
      })
      .filter((u): u is AlimiUniversity => u !== null);
  }
}
