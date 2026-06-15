import 'reflect-metadata';
import { loadEnv } from './common/env';
import { logger } from './common/logger';
import { startPdfWorker, workerDeps } from './jobs/pdf.worker';
import { startIngestWorker } from './jobs/ingest.worker';
import { startEmbedWorker } from './jobs/embed.worker';
import { closeQueues } from './jobs/queues';

// 워커 전용 엔트리포인트 — API와 분리 실행 (미션 P1).
// BullMQ 워커 3종: pdf(Playwright 렌더), ingest(커리어넷 적재), embed(임베딩).

async function main(): Promise<void> {
  loadEnv();
  const deps = workerDeps();
  await deps.prisma.$connect();

  const workers = [startPdfWorker(deps), startIngestWorker(deps.prisma), startEmbedWorker(deps.prisma)];
  logger.info({ workers: workers.map((w) => w.name) }, 'worker up');

  const shutdown = async (sig: string) => {
    logger.info({ sig }, 'worker shutting down');
    await Promise.allSettled(workers.map((w) => w.close()));
    await closeQueues();
    await deps.prisma.$disconnect();
    process.exit(0);
  };
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));

  // 워커 프로세스는 어떤 잡 실패에도 죽지 않는다 — 마지막 안전망
  process.on('unhandledRejection', (e) => logger.error({ err: e instanceof Error ? e.message : String(e) }, 'unhandledRejection'));
  process.on('uncaughtException', (e) => logger.error({ err: e.message, stack: e.stack }, 'uncaughtException'));
}

if (require.main === module) {
  main().catch((e) => {
    logger.error({ err: (e as Error).message }, 'worker bootstrap failed');
    process.exit(1);
  });
}
