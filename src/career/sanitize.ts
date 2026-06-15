// 커리어넷 dirty data 정제 (v4.1 실측 함정):
// - "null"/"undefined" 문자열 → null
// - <br>, </br>, &lt;br&gt;, &lt;/br&gt; 등 HTML 잔재 제거
// - \r\n 리터럴·실제 개행 → 공백, 중복 공백 축소, 앞뒤 trim
// - HTML 엔티티 일부 디코드 (&amp; &lt; &gt; &quot; &#39; &nbsp;)
// - 배열이어야 할 필드는 항상 배열로 (단일 객체/누락 → [x]/[])

const BR_RE = /<\s*\/?\s*br\s*\/?\s*>/gi;
const ENC_BR_RE = /&lt;\s*\/?\s*br\s*\/?\s*&gt;/gi;
const TAG_RE = /<\/?[a-zA-Z][^>]*>/g;

export function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    // 숫자 엔티티(&#13; &#xd; 등) — 실 API 상담 답변에 CR이 엔티티로 섞여 옴 (2026-06 검증)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => safeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => safeCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&');
}

function safeCodePoint(cp: number): string {
  if (!Number.isFinite(cp) || cp < 0 || cp > 0x10ffff) return ' ';
  if (cp < 32 && cp !== 10 && cp !== 9) return ' '; // 제어문자는 공백으로
  try {
    return String.fromCodePoint(cp);
  } catch {
    return ' ';
  }
}

/** 문자열 1개 정제. "null" → null. */
export function cleanString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  let s = String(value);
  // 인코딩된 <br> 먼저 제거(엔티티 디코드 전), 그 다음 디코드, 그 다음 실제 태그 제거
  s = s.replace(ENC_BR_RE, ' ');
  s = decodeEntities(s);
  s = s.replace(BR_RE, ' ');
  s = s.replace(TAG_RE, ' ');
  s = s.replace(/\\r\\n|\\n|\\r/g, ' '); // 리터럴 \r\n
  s = s.replace(/[\r\n\t]+/g, ' ');
  s = s.replace(/\s{2,}/g, ' ').trim();
  if (s === '' || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return null;
  return s;
}

/** 숫자로 와야 하는데 string으로 오는 케이스("12", " 12 ") 방어 */
export function cleanNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const s = cleanString(value);
  if (s === null) return null;
  const n = Number(s.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

/** 배열 정규화 — 단일 객체로 오는 케이스를 항상 배열로. null/undefined → [] */
export function ensureArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

/** 쉼표 나열 문자열("a,b, c") → 정제된 string[] */
export function splitList(value: unknown, sep: RegExp | string = /[,、]/): string[] {
  const s = cleanString(value);
  if (s === null) return [];
  return s
    .split(sep)
    .map((part) => cleanString(part))
    .filter((part): part is string => part !== null);
}

/** 객체 트리 전체를 재귀 정제 — 문자열 leaf만 cleanString 적용 */
export function deepClean<T>(value: T): T {
  if (typeof value === 'string') return cleanString(value) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => deepClean(v)) as unknown as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = deepClean(v);
    return out as unknown as T;
  }
  return value;
}
