import { createHash } from 'node:crypto';
import { env } from '../common/env';

// 임베딩 — 기본은 결정적 로컬 해시(256d, 외부 의존 0), EMBEDDING_PROVIDER=voyage + VOYAGE_API_KEY 설정 시
// Voyage AI 의미 임베딩(기본 1024d)으로 전환. pgvector 컬럼 차원은 scripts/reembed.ts가 맞춰준다.
// 해시는 키워드 매칭 수준, Voyage는 진짜 의미 검색 — RAG 품질 핵심. (구 DECISIONS #9의 YAGNI 해시는 교체됨)

export const EMBEDDING_DIM = 256; // 해시 기준 차원 (단위테스트/폴백). 실 컬럼 차원은 provider에 따름.

function useVoyage(): boolean {
  try {
    return env().EMBEDDING_PROVIDER === 'voyage' && !!env().VOYAGE_API_KEY;
  } catch {
    return false;
  }
}

/** 현재 활성 임베딩 차원 (voyage면 VOYAGE_DIM, 아니면 256) — 컬럼 마이그레이션/재임베딩에서 사용 */
export function activeEmbeddingDim(): number {
  return useVoyage() ? env().VOYAGE_DIM : EMBEDDING_DIM;
}

// ─── 해시 임베딩(로컬 폴백·기본) ───
function ngrams(text: string): string[] {
  const s = text.replace(/\s+/g, ' ').trim().toLowerCase();
  const grams: string[] = [];
  for (let n = 2; n <= 3; n++) for (let i = 0; i <= s.length - n; i++) grams.push(s.slice(i, i + n));
  for (const w of s.split(' ')) if (w) grams.push(w);
  return grams;
}

export function hashEmbed(text: string, dim: number = EMBEDDING_DIM): number[] {
  const vec = new Array<number>(dim).fill(0);
  if (!text || !text.trim()) return vec;
  for (const gram of ngrams(text)) {
    const h = createHash('md5').update(gram).digest();
    const bucket = h.readUInt32BE(0) % dim;
    const sign = h.readUInt8(4) % 2 === 0 ? 1 : -1;
    vec[bucket] += sign;
  }
  const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
  return norm === 0 ? vec : vec.map((v) => v / norm);
}

function sleep(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

// ─── Voyage AI 임베딩 ───
async function voyageEmbed(texts: string[], inputType: 'document' | 'query'): Promise<number[][]> {
  const key = env().VOYAGE_API_KEY;
  const model = env().VOYAGE_MODEL;
  const dim = env().VOYAGE_DIM;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('https://api.voyageai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ input: texts, model, input_type: inputType, output_dimension: dim }),
      });
      if (!res.ok) {
        if ((res.status === 429 || res.status >= 500) && attempt < 2) { await sleep(500 * (attempt + 1)); continue; }
        throw new Error(`voyage ${res.status}: ${(await res.text()).slice(0, 200)}`);
      }
      const json = (await res.json()) as { data: { embedding: number[]; index: number }[] };
      return json.data.slice().sort((a, b) => a.index - b.index).map((d) => d.embedding);
    } catch (e) {
      lastErr = e;
      if (attempt < 2) { await sleep(500 * (attempt + 1)); continue; }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('voyage embed failed');
}

/** 단일 텍스트 임베딩. 검색 쿼리는 inputType='query' 권장. voyage면 비동기 API, 아니면 로컬 해시. */
export async function embed(text: string, inputType: 'document' | 'query' = 'document'): Promise<number[]> {
  if (useVoyage()) {
    const [v] = await voyageEmbed([text || ''], inputType);
    return v;
  }
  return hashEmbed(text);
}

/** 배치 임베딩 (적재용). voyage는 한 번에 여러 개 — 효율적(상한 128). */
export async function embedBatch(texts: string[], inputType: 'document' | 'query' = 'document'): Promise<number[][]> {
  if (!texts.length) return [];
  if (useVoyage()) {
    const out: number[][] = [];
    for (let i = 0; i < texts.length; i += 128) {
      out.push(...(await voyageEmbed(texts.slice(i, i + 128), inputType)));
    }
    return out;
  }
  return texts.map((t) => hashEmbed(t));
}

export function toVectorLiteral(vec: number[]): string {
  return `[${vec.map((v) => v.toFixed(6)).join(',')}]`;
}
