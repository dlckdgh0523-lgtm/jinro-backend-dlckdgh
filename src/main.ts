import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';
import { env } from './common/env';
import { logger } from './common/logger';
import { runWithTrace } from './common/trace';
import { getQueues } from './jobs/queues';

export async function createApp(): Promise<NestExpressApplication> {
  env(); // 미로드 시에만 검증 로드 — 테스트의 loadEnv(overrides)를 보존
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, // 크기 제한을 위해 직접 등록
    logger: ['error', 'warn'],
  });

  // traceId 전파 — 모든 요청을 AsyncLocalStorage 컨텍스트로 감싼다
  app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    runWithTrace(req.headers['x-trace-id'] as string | undefined, () => next());
  });
  // 입력 크기 제한 (부하 가드)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  // NUL 바이트 제거 — PostgreSQL은 UTF-8 텍스트에 0x00을 거부한다 (퍼징으로 발견된 500 누수 방어)
  const stripNul = (v: unknown): unknown => {
    if (typeof v === 'string') return v.replaceAll('\u0000', '');
    if (Array.isArray(v)) return v.map(stripNul);
    if (v && typeof v === 'object') {
      for (const k of Object.keys(v as Record<string, unknown>)) (v as Record<string, unknown>)[k] = stripNul((v as Record<string, unknown>)[k]);
    }
    return v;
  };
  app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    if (req.body) req.body = stripNul(req.body);
    // Express 5의 req.query는 lazy getter — 정제본으로 교체해야 적용된다
    Object.defineProperty(req, 'query', { value: stripNul({ ...req.query }), writable: true, configurable: true });
    next();
  });
  // 요청 로깅 (pino)
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      logger.info({ method: req.method, path: req.originalUrl.split('?')[0], status: res.statusCode, ms: Date.now() - start }, 'http');
    });
    next();
  });

  // CORS 화이트리스트 + credentials (FRONTEND_CONTRACT §3)
  const origins = env()
    .CORS_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: (origin, cb) => cb(null, !origin || origins.includes(origin)),
    credentials: true,
    exposedHeaders: ['X-Trace-Id'],
  });

  app.enableShutdownHooks();
  return app;
}

async function bootstrap(): Promise<void> {
  const app = await createApp();
  await app.listen(env().PORT, '0.0.0.0');
  logger.info({ port: env().PORT, aiProvider: env().AI_PROVIDER }, 'api up');

  // ingestion cron 등록 (BullMQ repeatable — 워커가 처리)
  // - daily(04:00): 자주 바뀌는 데이터 (봉사·취업률·교환학생 등)
  // - monthly(매월 1일 03:00): 안 바뀌는 데이터 (학과 정보)
  // BullMQ jobId는 멱등 — 같은 시각 중복 enqueue돼도 1회만 실행
  try {
    await getQueues().ingest.upsertJobScheduler(
      'ingest-cron-daily',
      { pattern: env().INGEST_CRON },
      { name: 'daily', data: { scope: 'daily' } },
    );
    await getQueues().ingest.upsertJobScheduler(
      'ingest-cron-monthly',
      { pattern: env().INGEST_MONTHLY_CRON },
      { name: 'monthly', data: { scope: 'monthly' } },
    );
    if (env().INGEST_ON_BOOT) {
      // 멱등 jobId — 같은 날짜로 enqueue되면 중복 실행 안 함
      const today = new Date().toISOString().slice(0, 10);
      await getQueues().ingest.add('full', { scope: 'full' }, { jobId: `ingest-boot-${today}` });
    }
  } catch (e) {
    logger.warn({ err: (e as Error).message }, 'ingest scheduler registration failed (redis down?)');
  }
}

if (require.main === module) {
  bootstrap().catch((e) => {
    logger.error({ err: (e as Error).message, stack: (e as Error).stack }, 'bootstrap failed');
    process.exit(1);
  });
}
