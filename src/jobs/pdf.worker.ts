import { Worker, type Job } from 'bullmq';
import { chromium, type Browser } from 'playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { renderReportHtml, type ReportContent } from '../report/report-template';
import { storage } from '../common/storage';
import { env } from '../common/env';
import { logger } from '../common/logger';
import { sentry } from '../common/sentry';
import { createBullRedis } from '../common/redis';
import { getQueues, QUEUE_NAMES } from './queues';
import { PubSubService } from '../realtime/pubsub.service';
import { NotificationsService } from '../realtime/notifications.service';
import { PrismaService } from '../db/prisma.service';

// PDF 워커 — 미션 PDF 규칙 전체 준수:
// 브라우저 1개 재사용 + 잡마다 BrowserContext, 동시성 1~2, N잡마다 브라우저 재시작,
// 차트 렌더 시그널 대기, 한글 폰트 임베드, 출력은 storage(presigned-유사 URL), DLQ + Sentry.

interface PdfJobData {
  reportId: string;
  userId: string;
}

// 워커 모듈 소유의 관리되는 브라우저 싱글톤 (README 공유상태 예외 #1)
class BrowserManager {
  private browser: Browser | null = null;
  private jobsSinceLaunch = 0;

  async get(): Promise<Browser> {
    if (this.browser && this.jobsSinceLaunch >= env().PDF_BROWSER_RESTART_EVERY) {
      logger.info({ jobs: this.jobsSinceLaunch }, 'pdf browser scheduled restart (leak guard)');
      await this.close();
    }
    if (!this.browser || !this.browser.isConnected()) {
      this.browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
      this.jobsSinceLaunch = 0;
    }
    this.jobsSinceLaunch += 1;
    return this.browser;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close().catch((e: Error) => logger.warn({ err: e.message }, 'browser close failed'));
      this.browser = null;
    }
  }
}

let fontCache: string | null = null;
function pretendardBase64(): string {
  if (fontCache === null) {
    fontCache = readFileSync(join(process.cwd(), 'vendor', 'fonts', 'Pretendard-Regular.woff2')).toString('base64');
  }
  return fontCache;
}

export function startPdfWorker(deps: { prisma: PrismaClient; pubsub: PubSubService; notifications: NotificationsService }): Worker {
  const browsers = new BrowserManager();

  const worker = new Worker<PdfJobData>(
    QUEUE_NAMES.pdf,
    async (job: Job<PdfJobData>) => {
      const { reportId, userId } = job.data;
      const channel = `sse:job:${job.id}`;
      const progress = (pct: number, stage: string) => deps.pubsub.publish(channel, 'progress', { pct, stage });

      await progress(5, 'starting');
      const report = await deps.prisma.report.findUnique({ where: { id: reportId } });
      if (!report) throw new Error(`report ${reportId} not found`);
      await deps.prisma.report.update({ where: { id: reportId }, data: { status: 'rendering' } });

      const browser = await browsers.get();
      const context = await browser.newContext(); // 잡마다 격리된 컨텍스트
      try {
        const page = await context.newPage();
        const html = renderReportHtml(report.content as ReportContent, pretendardBase64());
        await progress(30, 'rendering');
        await page.setContent(html, { waitUntil: 'networkidle', timeout: 20_000 });
        // 차트(폰트 포함) 렌더 완료 시그널 대기
        await page.waitForFunction('window.__chartReady === true', undefined, { timeout: 10_000 });
        await progress(60, 'printing');
        const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });

        const key = `reports/${reportId}.pdf`;
        await storage.put(key, Buffer.from(pdf), 'application/pdf');
        await progress(90, 'uploading');
        await deps.prisma.report.update({ where: { id: reportId }, data: { status: 'done', pdfKey: key, error: null } });

        const pdfUrl = storage.getSignedUrl(key);
        await deps.pubsub.publish(channel, 'done', { reportId, pdfUrl });
        await deps.notifications.notify(userId, {
          type: 'ai.report.ready',
          dedupeKey: `ai.report.ready:${reportId}`,
          title: 'AI 진로 리포트가 준비됐어요',
          body: '대화에서 발견한 단서로 만든 리포트를 확인해보세요.',
          targetUrl: `/student/career/report?reportId=${reportId}`,
          payload: { reportId, pdfUrl },
        });
        return { key };
      } finally {
        await context.close().catch((e: Error) => logger.warn({ err: e.message }, 'context close failed'));
      }
    },
    {
      connection: createBullRedis(),
      concurrency: env().PDF_WORKER_CONCURRENCY,
      // 브라우저 크래시 등으로 잡이 stalled 되면 재시도
      stalledInterval: 30_000,
      maxStalledCount: 2,
    },
  );

  worker.on('failed', (job, err) => {
    void (async () => {
      logger.error({ jobId: job?.id, err: err.message, attempts: job?.attemptsMade }, 'pdf job failed');
      if (!job) return;
      if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
        // 재시도 소진 → DLQ + Sentry + 상태 반영 ("조용한 실패" 금지)
        sentry().captureException(err, { jobId: job.id, queue: 'pdf' });
        await getQueues().dlq.add('pdf-failed', { original: job.data, error: err.message, failedAt: new Date().toISOString() });
        await deps.prisma.report
          .update({ where: { id: job.data.reportId }, data: { status: 'failed', error: 'PDF_RENDER_FAILED' } })
          .catch((e: Error) => logger.warn({ err: e.message }, 'report fail-state update failed'));
        await deps.pubsub.publish(`sse:job:${job.id}`, 'error', { code: 'PDF_RENDER_FAILED', message: '리포트 생성에 실패했어요.' });
      }
    })();
  });

  worker.on('closed', () => void browsers.close());
  return worker;
}

// 워커 standalone 의존성 헬퍼
export function workerDeps(): { prisma: PrismaService; pubsub: PubSubService; notifications: NotificationsService } {
  const prisma = new PrismaService();
  const pubsub = new PubSubService();
  const notifications = new NotificationsService(prisma, pubsub);
  return { prisma, pubsub, notifications };
}
