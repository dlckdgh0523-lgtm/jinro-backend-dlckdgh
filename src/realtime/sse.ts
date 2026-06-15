import type { Request, Response } from 'express';
import { logger } from '../common/logger';

// SSE 연결 래퍼 — heartbeat(25s), X-Accel-Buffering:no, disconnect 정리, backpressure 가드.
// 인스턴스 내 연결 레지스트리는 realtime 모듈 소유의 승인된 싱글톤 (README 공유상태 예외 #2).

const HEARTBEAT_MS = 25_000;
const MAX_BUFFERED_BYTES = 1_000_000; // 클라가 너무 느리면(1MB 적체) 연결을 끊는다 — 좀비/메모리 보호

export interface SseEvent {
  id?: string | number;
  event?: string;
  data: unknown;
}

export class SseConnection {
  private heartbeat: NodeJS.Timeout;
  private closed = false;
  private cleanups: (() => void)[] = [];

  constructor(
    private readonly res: Response,
    req: Request,
  ) {
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
    res.write(`: connected ${new Date().toISOString()}\n\n`);

    this.heartbeat = setInterval(() => this.comment('hb'), HEARTBEAT_MS);
    const onClose = () => this.close();
    req.on('close', onClose);
    this.cleanups.push(() => req.off('close', onClose));
  }

  get isClosed(): boolean {
    return this.closed;
  }

  /** disconnect 시 호출될 정리 함수 등록 (Anthropic abort 등) */
  onClose(fn: () => void): void {
    if (this.closed) {
      fn();
      return;
    }
    this.cleanups.push(fn);
  }

  send(ev: SseEvent): void {
    if (this.closed) return;
    if (this.res.writableLength > MAX_BUFFERED_BYTES) {
      logger.warn('sse backpressure limit exceeded — closing connection');
      this.close();
      return;
    }
    let frame = '';
    if (ev.id !== undefined) frame += `id: ${ev.id}\n`;
    if (ev.event) frame += `event: ${ev.event}\n`;
    const payload = typeof ev.data === 'string' ? ev.data : JSON.stringify(ev.data);
    for (const line of payload.split('\n')) frame += `data: ${line}\n`;
    frame += '\n';
    this.res.write(frame);
  }

  comment(text: string): void {
    if (this.closed) return;
    this.res.write(`: ${text}\n\n`);
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    clearInterval(this.heartbeat);
    for (const fn of this.cleanups.splice(0)) {
      try {
        fn();
      } catch (e) {
        logger.warn({ err: (e as Error).message }, 'sse cleanup handler failed');
      }
    }
    try {
      this.res.end();
    } catch (e) {
      logger.debug({ err: (e as Error).message }, 'sse end failed (already closed)');
    }
  }
}
