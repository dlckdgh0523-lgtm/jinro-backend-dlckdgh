import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { CounselingService } from '../ai/counseling.service';
import { PrismaService } from '../db/prisma.service';
import { storage } from '../common/storage';
import { JwtAuthGuard, type AuthedRequest } from '../auth/jwt.guard';
import { AppError, ErrorCode } from '../common/errors';
import { parseOrThrow } from '../common/zod';
import { SseConnection } from '../realtime/sse';
import { PubSubService } from '../realtime/pubsub.service';

const createSchema = z.object({
  sessionId: z.string().min(1).max(64),
  idempotencyKey: z.string().max(128).optional(), // 명시적 멱등키는 세션 해시와 별개로 허용
});

// PDF 리포트 — 절대 요청 핸들러 인라인 금지: enqueue 후 { jobId } 반환 (미션 P4).
@Controller('v1')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(
    private readonly counseling: CounselingService,
    private readonly prisma: PrismaService,
    private readonly pubsub: PubSubService,
  ) {}

  @Post('reports')
  @HttpCode(202)
  async create(@Req() req: AuthedRequest, @Body() body: unknown) {
    const { sessionId } = parseOrThrow(createSchema, body);
    return this.counseling.generateReport(req.user.id, sessionId);
  }

  @Get('reports/:id')
  async get(@Req() req: AuthedRequest, @Param('id') id: string) {
    const report = await this.prisma.report.findUnique({ where: { id: parseOrThrow(z.string().max(64), id) } });
    if (!report || report.userId !== req.user.id) {
      throw new AppError(ErrorCode.REPORT_NOT_FOUND, '리포트를 찾을 수 없어요.');
    }
    return {
      data: {
        id: report.id,
        sessionId: report.sessionId,
        status: report.status,
        jobId: report.jobId,
        content: report.content,
        pdfUrl: report.status === 'done' && report.pdfKey ? storage.getSignedUrl(report.pdfKey) : null,
        error: report.error,
        createdAt: report.createdAt.toISOString(),
      },
    };
  }

  // 잡 진행 SSE — event: progress/done/error, Last-Event-ID 재전송 지원
  @Get('jobs/:id/events')
  async jobEvents(@Req() req: AuthedRequest, @Res() res: Response, @Param('id') id: string): Promise<void> {
    const jobId = parseOrThrow(z.string().max(128), id);
    const report = await this.prisma.report.findFirst({ where: { jobId } });
    if (!report || report.userId !== req.user.id) {
      throw new AppError(ErrorCode.PDF_JOB_NOT_FOUND, '작업을 찾을 수 없어요.');
    }
    const channel = `sse:job:${jobId}`;
    const conn = new SseConnection(res, req as Request);

    const lastIdRaw = (req.headers['last-event-id'] as string | undefined) ?? (req.query['lastEventId'] as string | undefined);
    const lastSeq = lastIdRaw && /^\d+$/.test(lastIdRaw) ? Number(lastIdRaw) : 0;
    for (const ev of await this.pubsub.replaySince(channel, lastSeq)) {
      conn.send({ id: ev.seq, event: ev.event, data: ev.data });
    }

    // 이미 종결 상태면 현재 상태를 쏘고 닫는다 (재연결 클라이언트 케이스)
    if (report.status === 'done' || report.status === 'failed') {
      conn.send({
        event: report.status === 'done' ? 'done' : 'error',
        data:
          report.status === 'done'
            ? { reportId: report.id, pdfUrl: report.pdfKey ? storage.getSignedUrl(report.pdfKey) : null }
            : { code: ErrorCode.PDF_RENDER_FAILED, message: '리포트 생성에 실패했어요.' },
      });
      conn.close();
      return;
    }
    const unsubscribe = await this.pubsub.subscribe(channel, (ev) => {
      conn.send({ id: ev.seq, event: ev.event, data: ev.data });
      if (ev.event === 'done' || ev.event === 'error') conn.close();
    });
    conn.onClose(unsubscribe);
  }
}

// 파일 다운로드 — presigned-유사 URL 검증 (공개 라우트: 서명이 곧 인가)
@Controller('v1/files')
export class FilesController {
  @Get(':key')
  async download(@Param('key') key: string, @Req() req: Request, @Res() res: Response): Promise<void> {
    const expires = Number(req.query['expires']);
    const sig = String(req.query['sig'] ?? '');
    const decodedKey = decodeURIComponent(key);
    if (!storage.verifySignature(decodedKey, expires, sig)) {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, '만료되었거나 잘못된 다운로드 링크예요.');
    }
    try {
      const { body, contentType } = await storage.get(decodedKey);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(decodedKey.split('/').pop() ?? 'file')}"`);
      res.send(body);
    } catch {
      throw new AppError(ErrorCode.NOT_FOUND, '파일을 찾을 수 없어요.');
    }
  }
}
