import { z } from 'zod';
import { aiClient, SYSTEM_PROMPT } from './ai-client';
import { logger } from '../common/logger';

// 사용자 발화에서 진로 단서(Signal) 추출.
// FRONTEND_CONTRACT §2.4: { tag: '흥미'|'강점'|'가치'|'맥락', text, sourceMessageId, confidence }
// - anthropic 모드: Haiku(JSON 출력)
// - mock 모드: 키워드 규칙 (결정적 — 테스트 가능)

export interface ExtractedSignal {
  tag: '흥미' | '강점' | '가치' | '맥락';
  text: string;
  confidence: 'high' | 'mid' | 'low';
}

const signalSchema = z.array(
  z.object({
    tag: z.enum(['흥미', '강점', '가치', '맥락']),
    text: z.string().min(1).max(200),
    confidence: z.enum(['high', 'mid', 'low']).default('mid'),
  }),
);

const RULES: { tag: ExtractedSignal['tag']; re: RegExp; confidence: ExtractedSignal['confidence'] }[] = [
  { tag: '흥미', re: /(좋아|재밌|재미있|흥미|즐거|몰입|빠져|관심)/, confidence: 'high' },
  { tag: '강점', re: /(잘하|잘 하|칭찬|뽑혔|상을|자신 있|자신있|소질|감각)/, confidence: 'high' },
  { tag: '가치', re: /(중요|보람|의미|돕고|도움이|기여|반응|인정)/, confidence: 'mid' },
  { tag: '맥락', re: /(동아리|학교|수업|친구|가족|부모|선생님|학원|대회)/, confidence: 'mid' },
];

export function extractSignalsByRule(text: string): ExtractedSignal[] {
  const out: ExtractedSignal[] = [];
  for (const rule of RULES) {
    if (rule.re.test(text)) {
      out.push({ tag: rule.tag, text: text.slice(0, 80), confidence: rule.confidence });
    }
  }
  return out;
}

export async function extractSignals(text: string): Promise<ExtractedSignal[]> {
  if (aiClient.provider === 'mock') return extractSignalsByRule(text);
  try {
    const { text: raw } = await aiClient.complete({
      tier: 'light',
      system:
        SYSTEM_PROMPT +
        '\n\n지금은 단서 추출 모드다. 학생 발화에서 진로 단서를 JSON 배열로만 출력하라. ' +
        '형식: [{"tag":"흥미|강점|가치|맥락","text":"단서 요약(80자 이내)","confidence":"high|mid|low"}]. 단서가 없으면 [].',
      messages: [{ role: 'user', content: text }],
      maxTokens: 400,
    });
    const jsonText = raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1);
    return signalSchema.parse(JSON.parse(jsonText));
  } catch (e) {
    // 추출 실패는 상담 흐름을 막지 않는다 — 규칙 폴백 후 로깅
    logger.warn({ err: (e as Error).message }, 'signal extraction failed — rule fallback');
    return extractSignalsByRule(text);
  }
}
