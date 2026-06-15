import { env } from '../common/env';
import { logger } from '../common/logger';
import { cleanString, ensureArray } from './sanitize';

// 커리어넷 진로교육자료(COSE) API — 학년별/활동유형별 자료.
// targt: C(공통)/E(초)/M(중)/I(일반고)/J(직업고)/V(대학)/U(기타)
// activityType: 102331(심리검사) 102332(진로상담) 102333(직업정보)
//               102334(진로·직업체험) 102335(창업) 102336(학교·학과)
//               102337(진로수업) 102338(학교·학급 운영) 102339(기타)

const ACTIVITY = {
  '102331': '진로심리검사',
  '102332': '진로상담',
  '102333': '직업정보',
  '102334': '진로·직업체험',
  '102335': '창업가정신 함양 교육',
  '102336': '학교·학과 정보',
  '102337': '진로수업 및 창의적 체험활동 운영',
  '102338': '학교·학급 운영',
  '102339': '기타',
} as const;
export type ActivityType = keyof typeof ACTIVITY;

export interface CoseItem {
  seq: string;
  title: string;
  author: string | null;
  year: number | null;
  activityType: string | null;
  achieveType: string | null;
  target: string | null; // 학년 코드 (C/E/M/I/J/V/U)
  attFile: string | null;
  content: string | null;
  selCount: number | null;
  regDate: Date | null;
  raw: Record<string, unknown>;
}

const TARGET_LABEL: Record<string, string> = { C: '공통', E: '초등학교', M: '중학교', I: '일반고', J: '직업고', V: '대학', U: '기타' };
export function targetLabel(t: string | null): string {
  return t ? TARGET_LABEL[t] ?? t : '미지정';
}

export class CoseClient {
  /**
   * 진로교육자료 페이지 조회.
   */
  async list(opts: { perPage?: number; thisPage?: number; targt?: string; activityType?: ActivityType; achieveType?: string } = {}): Promise<{ items: CoseItem[]; total: number }> {
    const url = new URL(`${env().CAREERNET_BASE_URL}/cnet/openapi/getOpenApi`);
    url.searchParams.set('apiKey', env().CAREERNET_API_KEY);
    url.searchParams.set('svcType', 'api');
    url.searchParams.set('svcCode', 'COSE');
    url.searchParams.set('contentType', 'json');
    url.searchParams.set('thisPage', String(opts.thisPage ?? 1));
    url.searchParams.set('perPage', String(opts.perPage ?? 100));
    if (opts.targt) url.searchParams.set('targt', opts.targt);
    if (opts.activityType) url.searchParams.set('activityType', opts.activityType);
    if (opts.achieveType) url.searchParams.set('achieveType', opts.achieveType);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15_000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (res.status >= 400) throw new Error(`cose http ${res.status}`);
      const json = (await res.json()) as Record<string, unknown>;
      const ds = json['dataSearch'] as Record<string, unknown> | undefined;
      const raw = ensureArray(ds?.['content'] as Record<string, unknown> | Record<string, unknown>[] | undefined);
      const items = raw
        .map((r) => {
          const seq = cleanString(r['seq']);
          const title = cleanString(r['dataTitle']);
          if (!seq || !title) return null;
          const item: CoseItem = {
            seq,
            title,
            author: cleanString(r['author']),
            year: Number(cleanString(r['year'])) || null,
            activityType: cleanString(r['activityType']),
            achieveType: cleanString(r['achieveType']),
            target: cleanString(r['targt']),
            attFile: cleanString(r['attFile']),
            content: null,
            selCount: Number(String(cleanString(r['selCount']) ?? '').replace(/,/g, '')) || null,
            regDate: cleanString(r['regDate']) ? new Date(`${cleanString(r['regDate'])}T00:00:00Z`) : null,
            raw: r,
          };
          return item;
        })
        .filter((v): v is CoseItem => v !== null);
      return { items, total: items.length };
    } finally {
      clearTimeout(timer);
    }
  }
}

export const __coseTest = { ACTIVITY, targetLabel };
