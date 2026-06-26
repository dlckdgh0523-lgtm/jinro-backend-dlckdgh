import { Controller, Get, Param, Post, Query, Req, Res, UseGuards, Body, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { CounselingService } from './counseling.service';
import { SseConnection } from '../realtime/sse';
import { PubSubService } from '../realtime/pubsub.service';
import { JwtAuthGuard, type AuthedRequest } from '../auth/jwt.guard';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';
import { currentTraceId } from '../common/trace';

const messageSchema = z.object({
  text: z.string().trim().min(1, '메시지를 입력해주세요').max(2_000, '메시지는 2000자 이하여야 해요'),
});
const idSchema = z.string().min(1).max(64);
const createSessionSchema = z.object({
  subjectStudentId: z.string().max(64).optional().nullable(),
  title: z.string().max(80).optional().nullable(),
}).partial();
const patchSessionSchema = z.object({
  title: z.string().max(80).optional().nullable(),
  status: z.enum(['active', 'ended']).optional(),
}).partial();
const listSessionQuerySchema = z.object({
  status: z.enum(['active', 'ended', 'all']).optional(),
}).partial();

@Controller('v1/ai-counseling')
@UseGuards(JwtAuthGuard)
export class CounselingController {
  constructor(
    private readonly counseling: CounselingService,
    private readonly pubsub: PubSubService,
  ) {}

  @Post('sessions')
  @HttpCode(201)
  createSession(@Req() req: AuthedRequest, @Body() body: unknown) {
    const parsed = parseOrThrow(createSessionSchema, body ?? {});
    return this.counseling.createSession(req.user.id, parsed);
  }

  @Get('sessions/active')
  activeSession(@Req() req: AuthedRequest) {
    return this.counseling.activeSession(req.user.id);
  }

  /** 세션 목록 — 교사 대화창 사이드바용(학생별/자유 모두). */
  @Get('sessions')
  listSessions(@Req() req: AuthedRequest, @Query() query: Record<string, string>) {
    const opts = parseOrThrow(listSessionQuerySchema, query ?? {});
    return this.counseling.listSessions(req.user.id, opts);
  }

  /** 세션 제목 변경 / 종료. */
  @Post('sessions/:id/patch')
  @HttpCode(200)
  patchSession(@Req() req: AuthedRequest, @Param('id') id: string, @Body() body: unknown) {
    const parsed = parseOrThrow(patchSessionSchema, body ?? {});
    return this.counseling.updateSession(req.user.id, parseOrThrow(idSchema, id), parsed);
  }

  /** 세션 삭제 (메시지/시그널/리포트 cascade). */
  @Post('sessions/:id/delete')
  @HttpCode(200)
  deleteSession(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.counseling.deleteSession(req.user.id, parseOrThrow(idSchema, id));
  }

  @Get('sessions/:id/transcript')
  transcript(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.counseling.transcript(req.user.id, parseOrThrow(idSchema, id));
  }

  @Get('sessions/:id/progress')
  progress(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.counseling.progress(req.user.id, parseOrThrow(idSchema, id));
  }

  /**
   * 메시지 전송 — 기본 SSE 스트리밍(event: token/done/error), ?stream=false면 JSON 즉답.
   * 클라 disconnect 시 AbortController로 AI 스트림 중단 (미션 SSE 규칙).
   * AI 상담 rate limit 30/min (backend-integration.md §13).
   */
  @Post('sessions/:id/messages')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async sendMessage(
    @Req() req: AuthedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: unknown,
    @Query('stream') stream?: string,
  ): Promise<void> {
    const sessionId = parseOrThrow(idSchema, id);
    const { text } = parseOrThrow(messageSchema, body);

    if (stream === 'false') {
      const result = await this.counseling.sendMessageSync(req.user.id, sessionId, text);
      res.status(200).json(result);
      return;
    }

    const conn = new SseConnection(res, req as Request);
    const abort = new AbortController();
    conn.onClose(() => abort.abort());

    try {
      await this.counseling.sendMessage(req.user.id, sessionId, text, abort.signal, {
        onToken: (t) => conn.send({ event: 'token', data: { delta: t } }),
        onDone: (p) => conn.send({ event: 'done', data: p }),
      });
    } catch (e) {
      // 스트림 중 에러는 SSE event: error로 전달 (헤더 이미 전송됨 — JSON 불가)
      const appErr =
        e instanceof AppError ? e : new AppError(ErrorCode.AI_UNAVAILABLE, 'AI 응답을 생성하지 못했어요.', { cause: e });
      if (appErr.code !== ErrorCode.AI_STREAM_ABORTED) {
        conn.send({ event: 'error', data: { code: appErr.code, message: appErr.message, traceId: currentTraceId() } });
      }
    } finally {
      conn.close();
    }
  }

  /**
   * EventSource 대안 — 진행 중/완료된 AI 메시지 토큰 재수신 (Last-Event-ID 재개 지원).
   * POST 스트림이 끊겼을 때 클라가 messageId로 재접속한다.
   */
  @Get('sessions/:id/stream')
  async streamMessage(
    @Req() req: AuthedRequest,
    @Res() res: Response,
    @Param('id') id: string,
    @Query('messageId') messageId?: string,
  ): Promise<void> {
    await this.counseling.transcript(req.user.id, parseOrThrow(idSchema, id)); // 소유권 검증
    const msgId = parseOrThrow(idSchema, messageId ?? '');
    const channel = `sse:aimsg:${msgId}`;
    const conn = new SseConnection(res, req as Request);

    const lastIdRaw = (req.headers['last-event-id'] as string | undefined) ?? (req.query['lastEventId'] as string | undefined);
    const lastSeq = lastIdRaw && /^\d+$/.test(lastIdRaw) ? Number(lastIdRaw) : 0;
    const buffered = await this.pubsub.replaySince(channel, lastSeq);
    for (const ev of buffered) conn.send({ id: ev.seq, event: ev.event, data: ev.data });

    if (buffered.some((b) => b.event === 'done' || b.event === 'error')) {
      conn.close();
      return;
    }
    const unsubscribe = await this.pubsub.subscribe(channel, (ev) => {
      conn.send({ id: ev.seq, event: ev.event, data: ev.data });
      if (ev.event === 'done' || ev.event === 'error') conn.close();
    });
    conn.onClose(unsubscribe);
  }

  @Post('sessions/:id/report')
  @HttpCode(202)
  generateReport(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.counseling.generateReport(req.user.id, parseOrThrow(idSchema, id));
  }

  @Get('reports/:id')
  getReport(@Req() req: AuthedRequest, @Param('id') id: string) {
    return this.counseling.getReport(req.user.id, parseOrThrow(idSchema, id));
  }
}
