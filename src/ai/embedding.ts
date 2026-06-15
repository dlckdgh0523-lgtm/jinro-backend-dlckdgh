import { createHash } from 'node:crypto';

// 단일 임베딩 구현 (DECISIONS #9 — 인터페이스 추상화 금지, YAGNI).
// 결정적 로컬 해시 임베딩: 문자 bi/tri-gram을 256버킷에 해싱 후 L2 정규화.
// 한국어 짧은 정형 텍스트(직업/학과명)에 외부 모델 없이 동작하는 베이스라인.
// 실서비스 임베딩 교체 의도는 MEMORY.md에 기록되어 있다.

export const EMBEDDING_DIM = 256;

function ngrams(text: string): string[] {
  const s = text.replace(/\s+/g, ' ').trim().toLowerCase();
  const grams: string[] = [];
  for (let n = 2; n <= 3; n++) {
    for (let i = 0; i <= s.length - n; i++) grams.push(s.slice(i, i + n));
  }
  // 짧은 텍스트 보호 — 단어 자체도 포함
  for (const w of s.split(' ')) if (w) grams.push(w);
  return grams;
}

export function embed(text: string): number[] {
  const vec = new Array<number>(EMBEDDING_DIM).fill(0);
  if (!text || !text.trim()) return vec;
  for (const gram of ngrams(text)) {
    const h = createHash('md5').update(gram).digest();
    const bucket = h.readUInt32BE(0) % EMBEDDING_DIM;
    const sign = h.readUInt8(4) % 2 === 0 ? 1 : -1;
    vec[bucket] += sign;
  }
  const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
  if (norm === 0) return vec;
  return vec.map((v) => v / norm);
}

export function toVectorLiteral(vec: number[]): string {
  return `[${vec.map((v) => v.toFixed(6)).join(',')}]`;
}
