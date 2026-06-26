import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { env } from './common/env';
import { logger } from './common/logger';
import { initSentry } from './common/sentry';
import { runWithTrace } from './common/trace';
import { getQueues } from './jobs/queues';

export async function createApp(): Promise<NestExpressApplication> {
  env(); // 미로드 시에만 검증 로드 — 테스트의 loadEnv(overrides)를 보존
  initSentry(); // SENTRY_DSN 있으면 활성화, 없으면 무해하게 스킵
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, // 크기 제한을 위해 직접 등록
    logger: ['error', 'warn'],
  });

  // 보안 헤더 (Helmet) — 학생 데이터 보호 핵심:
  // - HSTS: HTTPS 강제(브라우저가 다시 HTTP 안 씀)
  // - X-Content-Type-Options:nosniff: MIME 스니핑 차단
  // - X-Frame-Options:DENY: 클릭재킹 차단 (다른 사이트가 iframe으로 우리 화면 못 끼움)
  // - Referrer-Policy: 외부 사이트로 학생 URL 정보 흘리지 않음
  // - CSP는 별도 — 현재 frontend가 인라인 스크립트 많아 보수적 설정(연결만 same-origin)
  // Caddy가 이미 일부 헤더 줄 수 있어 false 옵션은 충돌 시 추후 조정.
  app.use(
    helmet({
      contentSecurityPolicy: false, // enforce 모드는 인라인 스크립트와 충돌 — 아래에서 Report-Only로 점진적 적용
      crossOriginEmbedderPolicy: false, // SSE/외부 폰트와 호환
      strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true, preload: false },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      frameguard: { action: 'deny' },
      noSniff: true,
      hidePoweredBy: true,
    }),
  );
  // CSP enforce — 보수적 정책. 인라인 스크립트가 많아 unsafe-inline은 일단 유지(레거시 호환).
  // unsafe-inline 제거는 다음 단계에서 nonce 도입과 함께. 지금도 frame-ancestors/object-src/base-uri는 강제 차단됨.
  app.use((_req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        // 인라인 <script>는 외부 파일로 모두 분리됨(_live-config.js + build-legacy가 _mount.js로 추출) → unsafe-inline 제거 = 진짜 XSS 방어.
        "script-src 'self' https://unpkg.com https://cdnjs.cloudflare.com",
        "script-src-attr 'none'",       // onclick="..." 같은 HTML 인라인 핸들러 금지(React onClick은 영향 없음)
        // React는 style="..." 인라인 스타일이 매우 많아 unsafe-inline 유지 — 점진적으로 줄일 예정
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' https://cdn.jsdelivr.net data:",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://api.jinronavi.kr https://www.jinro.it.kr",
        "frame-ancestors 'none'",      // iframe 임베드 금지 (clickjacking)
        "object-src 'none'",            // Flash/플러그인 금지
        "base-uri 'self'",              // <base> 변조 차단
        "form-action 'self'",           // 폼 제출 도메인 제한
        "upgrade-insecure-requests",    // http 요청을 https로 자동 승격
      ].join('; '),
    );
    next();
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
