import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { env } from '../common/env';
import { AppError, ErrorCode } from '../common/errors';
import { logger } from '../common/logger';

// Claude 오케스트레이션 진입점 — AI_PROVIDER=mock(기본, 키 부재) | anthropic.
// Haiku = 저비용(시그널 추출/라우팅), Sonnet = 최종 합성 (DECISIONS #12).
// system+RAG 컨텍스트에 prompt caching(cache_control) 적용.

export type StreamEvent =
  | { type: 'token'; text: string }
  | { type: 'done'; usage: { inputTokens: number; outputTokens: number } };

export interface ChatOptions {
  tier: 'light' | 'heavy';
  system: string;
  ragContext?: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxTokens?: number;
  signal?: AbortSignal;
}

function loadSystemPrompt(): string {
  // prompt.md = 서비스 내 AI에게 줄 프롬프트 (저장소 루트, 사용자 제공)
  try {
    return readFileSync(join(process.cwd(), 'prompt.md'), 'utf8');
  } catch {
    return '너는 진로나침반의 진로상담 AI다. 한국어 존댓말로, 따뜻하고 근거 있게 학생의 진로 탐색을 돕는다.';
  }
}

export const SYSTEM_PROMPT = loadSystemPrompt();

// mock 응답 코퍼스 — 토큰 스트림으로 잘라 내보낸다 (부하테스트에서도 사용)
// 질문으로 끝나는 응답에는 마지막 줄에 [보기] 샘플 답변을 붙여, 키 없이도 quick-reply chip 기능을 테스트할 수 있게 한다.
const MOCK_REPLIES = [
  '말씀해주신 이야기 잘 들었어요. 영상이나 콘텐츠를 만들 때 몰입하신다는 점이 인상적이에요. 그 순간에 어떤 부분이 가장 재미있었는지 조금 더 들려주실 수 있을까요? 예를 들어 기획을 짤 때인지, 직접 편집하면서 결과물이 달라지는 걸 볼 때인지 궁금해요.\n[보기] 편집할 때가 제일 재밌어요 | 기획을 짤 때요 | 아직 잘 모르겠어요',
  '좋아요, 그 경험에서 강점 단서가 보여요. 시각적인 흐름을 읽는 감각은 미디어 콘텐츠 디자이너나 영상 편집자 같은 직업과 잘 맞닿아 있어요. 다만 한 직업으로 좁히기보다, 비슷한 결의 인접 직업도 함께 살펴보면 선택지가 넓어져요. 관련 학과로는 영상디자인학과, 디지털콘텐츠디자인학과 등이 있어요.',
  '지금까지의 대화에서 흥미·강점 단서가 꽤 쌓였어요. 원하시면 직업·전공·대학을 근거 자료와 함께 정리해볼 수도 있어요. 물론 계속 자유롭게 이야기해도 좋아요. 어떤 쪽이 편하세요?\n[보기] 직업·전공을 정리해주세요 | 더 자유롭게 이야기할래요 | 아직 잘 모르겠어요',
];

function mapAnthropicError(e: unknown): AppError {
  const err = e as { status?: number; error?: { type?: string }; message?: string; name?: string };
  if (err.name === 'AbortError' || (err.message ?? '').includes('aborted')) {
    return new AppError(ErrorCode.AI_STREAM_ABORTED, '응답 생성이 중단됐어요.', { cause: e });
  }
  switch (err.status) {
    case 429:
      return new AppError(ErrorCode.AI_RATE_LIMITED, 'AI 상담 요청이 많아요. 잠시 후 다시 시도해주세요.', { cause: e });
    case 529:
      return new AppError(ErrorCode.AI_OVERLOADED, 'AI 서버가 혼잡해요. 잠시 후 다시 시도해주세요.', { cause: e });
    case 400: {
      const msg = err.message ?? '';
      if (msg.includes('prompt is too long') || msg.includes('context')) {
        return new AppError(ErrorCode.AI_CONTEXT_TOO_LARGE, '대화가 너무 길어졌어요. 새 상담을 시작해주세요.', { cause: e });
      }
      return new AppError(ErrorCode.AI_UNAVAILABLE, 'AI 응답을 생성하지 못했어요.', { cause: e });
    }
    default:
      return new AppError(ErrorCode.AI_UNAVAILABLE, 'AI 응답을 생성하지 못했어요.', { cause: e });
  }
}

export class AiClient {
  private anthropic: Anthropic | null = null;

  get provider(): 'mock' | 'anthropic' {
    return env().AI_PROVIDER === 'anthropic' && env().ANTHROPIC_API_KEY ? 'anthropic' : 'mock';
  }

  private sdk(): Anthropic {
    if (!this.anthropic) {
      this.anthropic = new Anthropic({ apiKey: env().ANTHROPIC_API_KEY, maxRetries: 2 });
    }
    return this.anthropic;
  }

  /** 토큰 스트림. 호출자가 disconnect 시 signal abort → 즉시 중단. */
  async *streamChat(opts: ChatOptions): AsyncGenerator<StreamEvent> {
    // 토큰/비용 가드 — 입력 컨텍스트 길이 상한
    const totalChars = opts.system.length + (opts.ragContext?.length ?? 0) + opts.messages.reduce((a, m) => a + m.content.length, 0);
    if (totalChars > env().AI_MAX_INPUT_CHARS) {
      throw new AppError(ErrorCode.AI_CONTEXT_TOO_LARGE, '대화가 너무 길어졌어요. 새 상담을 시작해주세요.');
    }
    if (this.provider === 'mock') {
      yield* this.mockStream(opts);
      return;
    }
    yield* this.anthropicStream(opts);
  }

  private async *mockStream(opts: ChatOptions): AsyncGenerator<StreamEvent> {
    const userTurns = opts.messages.filter((m) => m.role === 'user').length;
    const reply = MOCK_REPLIES[Math.min(userTurns - 1, MOCK_REPLIES.length - 1)] ?? MOCK_REPLIES[0]!;
    // 2~4자 단위 토큰화 + 3ms 간격 — 실제 스트리밍 형태 재현
    const tokens: string[] = [];
    for (let i = 0; i < reply.length; i += 3) tokens.push(reply.slice(i, i + 3));
    let out = 0;
    for (const t of tokens) {
      if (opts.signal?.aborted) {
        throw new AppError(ErrorCode.AI_STREAM_ABORTED, '응답 생성이 중단됐어요.');
      }
      await new Promise((r) => setTimeout(r, 3));
      out += 1;
      yield { type: 'token', text: t };
    }
    yield { type: 'done', usage: { inputTokens: Math.ceil(totalCharsOf(opts) / 4), outputTokens: out } };
  }

  private async *anthropicStream(opts: ChatOptions): AsyncGenerator<StreamEvent> {
    const model = opts.tier === 'heavy' ? env().AI_MODEL_HEAVY : env().AI_MODEL_LIGHT;
    // 비용 가드 상한 — heavy(리포트 합성)는 더 긴 출력 허용 (light에서 잘려 JSON 파싱 실패하던 문제)
    const ceiling = opts.tier === 'heavy' ? env().AI_MAX_REPORT_TOKENS : env().AI_MAX_OUTPUT_TOKENS;
    try {
      const stream = this.sdk().messages.stream(
        {
          model,
          max_tokens: Math.min(opts.maxTokens ?? ceiling, ceiling),
          // prompt caching — 시스템 프롬프트(고정)와 RAG 컨텍스트(세션 내 재사용)에 cache_control
          system: [
            { type: 'text' as const, text: opts.system, cache_control: { type: 'ephemeral' as const } },
            ...(opts.ragContext
              ? [{ type: 'text' as const, text: `<context>\n${opts.ragContext}\n</context>`, cache_control: { type: 'ephemeral' as const } }]
              : []),
          ],
          messages: opts.messages,
        },
        { signal: opts.signal },
      );
      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield { type: 'token', text: event.delta.text };
        }
      }
      const final = await stream.finalMessage();
      if ((final.stop_reason as string) === 'refusal') {
        throw new AppError(ErrorCode.AI_CONTENT_FILTERED, '이 주제는 답변해드리기 어려워요. 다른 질문을 해주세요.');
      }
      const usage = { inputTokens: final.usage.input_tokens, outputTokens: final.usage.output_tokens };
      logger.info({ model, ...usage }, 'ai usage'); // 토큰/비용 로깅 필수 (계약 §3)
      yield { type: 'done', usage };
    } catch (e) {
      if (e instanceof AppError) throw e;
      throw mapAnthropicError(e);
    }
  }

  /** 비스트리밍 1회 호출 (시그널 추출·리포트 합성) */
  async complete(opts: ChatOptions): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
    let text = '';
    let usage = { inputTokens: 0, outputTokens: 0 };
    for await (const ev of this.streamChat(opts)) {
      if (ev.type === 'token') text += ev.text;
      else usage = ev.usage;
    }
    return { text, usage };
  }
}

function totalCharsOf(opts: ChatOptions): number {
  return opts.system.length + (opts.ragContext?.length ?? 0) + opts.messages.reduce((a, m) => a + m.content.length, 0);
}

export const aiClient = new AiClient();
