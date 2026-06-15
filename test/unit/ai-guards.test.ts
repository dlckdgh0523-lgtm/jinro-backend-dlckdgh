import { beforeEach, describe, expect, it } from 'vitest';
import { AiClient } from '../../src/ai/ai-client';
import { extractSignalsByRule } from '../../src/ai/signals';
import { embed, EMBEDDING_DIM, toVectorLiteral } from '../../src/ai/embedding';
import { AppError, ErrorCode } from '../../src/common/errors';
import { loadEnv, resetEnvForTest } from '../../src/common/env';

describe('AI 가드/시그널/임베딩 (mock provider)', () => {
  beforeEach(() => {
    resetEnvForTest();
    loadEnv({ AI_PROVIDER: 'mock', AI_MAX_INPUT_CHARS: '1000' });
  });

  it('mock 스트림 — token 시퀀스 후 done(usage 포함)', async () => {
    const client = new AiClient();
    const events: string[] = [];
    let text = '';
    for await (const ev of client.streamChat({ tier: 'light', system: 's', messages: [{ role: 'user', content: '안녕' }] })) {
      events.push(ev.type);
      if (ev.type === 'token') text += ev.text;
    }
    expect(events[events.length - 1]).toBe('done');
    expect(events.filter((e) => e === 'token').length).toBeGreaterThan(5);
    expect(text.length).toBeGreaterThan(20);
  });

  it('입력 컨텍스트 상한 초과 → AI_CONTEXT_TOO_LARGE', async () => {
    const client = new AiClient();
    const big = 'ㄱ'.repeat(2000);
    await expect(async () => {
      for await (const _ of client.streamChat({ tier: 'light', system: big, messages: [{ role: 'user', content: '안녕' }] })) {
        /* drain */
      }
    }).rejects.toThrowError(/대화가 너무 길어/);
  });

  it('abort signal → AI_STREAM_ABORTED (disconnect 시 중단 계약)', async () => {
    const client = new AiClient();
    const ctrl = new AbortController();
    let count = 0;
    await expect(async () => {
      for await (const ev of client.streamChat({ tier: 'light', system: 's', messages: [{ role: 'user', content: '안녕' }], signal: ctrl.signal })) {
        if (ev.type === 'token' && ++count === 3) ctrl.abort();
      }
    }).rejects.toSatisfy((e: unknown) => e instanceof AppError && e.code === ErrorCode.AI_STREAM_ABORTED);
    expect(count).toBeLessThan(10); // 즉시 중단됐는지
  });

  it('규칙 기반 시그널 추출 — 4태그', () => {
    const s1 = extractSignalsByRule('동아리에서 영상 편집이 정말 재밌었어요');
    expect(s1.map((s) => s.tag)).toContain('흥미');
    expect(s1.map((s) => s.tag)).toContain('맥락');
    expect(extractSignalsByRule('수학을 잘해서 칭찬받아요').map((s) => s.tag)).toContain('강점');
    expect(extractSignalsByRule('사람을 돕고 싶어요. 그게 중요해요').map((s) => s.tag)).toContain('가치');
    expect(extractSignalsByRule('음 그냥 그래요')).toEqual([]);
  });

  it('임베딩 — 결정적, 정규화, 차원 고정', () => {
    const a = embed('영상 편집');
    const b = embed('영상 편집');
    expect(a).toEqual(b);
    expect(a).toHaveLength(EMBEDDING_DIM);
    const norm = Math.sqrt(a.reduce((acc, v) => acc + v * v, 0));
    expect(norm).toBeCloseTo(1, 5);
    expect(toVectorLiteral([0.5, -0.25])).toBe('[0.500000,-0.250000]');
    // 의미적으로 비슷한 텍스트가 다른 텍스트보다 가깝다 (n-gram 공유)
    const cos = (x: number[], y: number[]) => x.reduce((s, v, i) => s + v * y[i]!, 0);
    expect(cos(embed('영상 편집자'), embed('영상 편집'))).toBeGreaterThan(cos(embed('영상 편집자'), embed('회계 사무원')));
  });
});
