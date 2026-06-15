import { XMLParser } from 'fast-xml-parser';
import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString, ensureArray } from '../career/sanitize';

// 한국사회복지협의회 봉사활동 API (VMS, data.go.kr B460014).
// resultCode '00' = NORMAL. 호출별 응답 wrapper: response.body.items.item[]
// 주의: 키 발급 직후 게이트웨이 전파에 수 분 걸릴 수 있음(검증 시 403 → 재시도 필요).

const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, trimValues: true });

export interface VolunteerCenter {
  centCode: string;
  centName: string;
  areaName: string | null;
  centTypeName: string | null;
  address: string | null;
  contact: string | null;
}

export interface VolunteerRecruit {
  externalId: string;
  title: string;
  centerName: string | null;
  centerType: string | null;
  region: string | null;
  areaCode: string | null;
  startDate: Date | null;
  endDate: Date | null;
  recruitFrom: Date | null;
  recruitTo: Date | null;
  recruitCount: number | null;
  youthEligible: boolean;
  address: string | null;
  contact: string | null;
  raw: Record<string, unknown>;
}

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const v = String(s).replace(/-/g, '').padEnd(8, '0');
  if (v.length < 8 || !/^\d{8}$/.test(v.slice(0, 8))) return null;
  const d = new Date(`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T00:00:00Z`);
  return isNaN(+d) ? null : d;
}

export class VmsClient {
  get enabled(): boolean {
    return env().DATA_GO_KR_API_KEY !== '';
  }

  private async get(op: string, params: Record<string, string | number>): Promise<{ items: Record<string, unknown>[]; total: number }> {
    const url = new URL(`${env().VMS_BASE_URL}/${op}`);
    url.searchParams.set('serviceKey', env().DATA_GO_KR_API_KEY);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15_000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (res.status >= 400) throw new Error(`vms http ${res.status}`);
      const text = await res.text();
      const root = parser.parse(text) as Record<string, unknown>;
      const response = root['response'] as Record<string, unknown> | undefined;
      const header = response?.['header'] as Record<string, unknown> | undefined;
      const code = String(header?.['resultCode'] ?? '');
      if (code !== '00') throw new Error(`vms ${code}: ${String(header?.['resultMsg'] ?? '')}`);
      const body = response?.['body'] as Record<string, unknown> | undefined;
      const items = ensureArray((body?.['items'] as Record<string, unknown> | undefined)?.['item'] as Record<string, unknown> | Record<string, unknown>[] | undefined);
      const total = Number(body?.['totalCount'] ?? 0);
      return { items, total };
    } finally {
      clearTimeout(timer);
    }
  }

  async listCenters(pageNo = 1, numOfRows = 100): Promise<{ items: VolunteerCenter[]; total: number }> {
    const { items, total } = await this.get('getCenterList', { pageNo, numOfRows });
    return {
      total,
      items: items
        .map((r) => {
          const centCode = cleanString(r['centCode']);
          const centName = cleanString(r['centName']);
          if (!centCode || !centName) return null;
          return {
            centCode,
            centName,
            areaName: cleanString(r['areaName']),
            centTypeName: cleanString(r['centTypeName']),
            address: cleanString(r['addr']),
            contact: cleanString(r['telNum']),
          } satisfies VolunteerCenter;
        })
        .filter((v): v is VolunteerCenter => v !== null),
    };
  }

  /**
   * 봉사활동 모집 정보. youthOnly=true면 청소년 가능 항목만.
   * 응답 필드명은 운영 시점에 가변적이므로 여러 후보를 흡수한다.
   */
  async listRecruits(opts: { pageNo?: number; numOfRows?: number; areaCode?: string; strDate?: string; endDate?: string } = {}): Promise<{ items: VolunteerRecruit[]; total: number }> {
    // VMS 모집정보 - 활용가이드 v1.3 확인: strDate/endDate (YYYY-MM-DD), areaCode 선택
    // 기본: 오늘 ~ +90일 (지금 모집 중인 청소년 봉사)
    const today = new Date();
    const plus90 = new Date(today.getTime() + 90 * 24 * 3600 * 1000);
    const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const params: Record<string, string | number> = {
      pageNo: opts.pageNo ?? 1,
      numOfRows: opts.numOfRows ?? 100,
      strDate: opts.strDate ?? fmt(today),
      endDate: opts.endDate ?? fmt(plus90),
    };
    if (opts.areaCode) params.areaCode = opts.areaCode;
    const { items, total } = await this.get('getVollcolectionList', params);
    // 실제 응답 필드: seq, title, centName, reqName, areaName, place, reqCnt, partCnt,
    //   regDate, actTypeName(활동유형), termType/termTypeName(정기/비정기), status/statusName(모집중/완료), teenager(청소년 Y/N)
    return {
      total,
      items: items
        .map((r): VolunteerRecruit | null => {
          const seq = cleanString(r['seq'] ?? r['progrmRegistNo']);
          const title = cleanString(r['title'] ?? r['progrmSj']);
          if (!seq || !title) return null;
          const teen = String(r['teenager'] ?? 'N').toUpperCase();
          return {
            externalId: `recruit-${seq}`,
            title,
            centerName: cleanString(r['centName'] ?? r['reqName']),
            centerType: cleanString(r['actTypeName']), // 활동유형(각종행사보조/교육지원 등)
            region: cleanString(r['areaName']),
            areaCode: cleanString(r['areaCode']),
            startDate: null, // 목록 API는 활동 일자/시간을 제공하지 않음
            endDate: null,
            recruitFrom: null,
            recruitTo: null,
            recruitCount: Number(cleanString(r['reqCnt'] ?? r['rcritNmpr'])) || null,
            youthEligible: teen === 'Y',
            address: cleanString(r['place']), // 활동 장소
            contact: null, // 목록엔 연락처 없음 — 센터 매칭으로 보강 가능
            raw: r,
          } satisfies VolunteerRecruit;
        })
        .filter((v): v is VolunteerRecruit => v !== null),
    };
  }
}

export const __vmsTest = { parseDate };
