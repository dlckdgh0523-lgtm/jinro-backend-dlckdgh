import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { createRedis } from './redis';
import { env } from './env';
import { AppError, ErrorCode } from './errors';
import { JwtAuthGuard, type AuthedRequest } from '../auth/jwt.guard';
import { getQueues } from '../jobs/queues';
import { aiClient } from '../ai/ai-client';
import type Redis from 'ioredis';

const startedAt = Date.now();

@Controller()
export class HealthController {
  private redis: Redis | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private redisClient(): Redis {
    if (!this.redis) this.redis = createRedis('health');
    return this.redis;
  }

  @Get('health')
  health() {
    return { status: 'ok', uptimeSec: Math.floor((Date.now() - startedAt) / 1000) };
  }

  @Get('ready')
  async ready() {
    const checks: Record<string, 'ok' | 'down'> = { db: 'down', redis: 'down' };
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks['db'] = 'ok';
    } catch {
      /* down 유지 */
    }
    try {
      const pong = await this.redisClient().ping();
      if (pong === 'PONG') checks['redis'] = 'ok';
    } catch {
      /* down 유지 */
    }
    const ok = Object.values(checks).every((v) => v === 'ok');
    if (!ok) {
      throw new AppError(ErrorCode.INTERNAL, '준비되지 않았어요.', { status: 503, details: checks });
    }
    return { status: 'ready', checks };
  }

  // §11 부분 구현 — build/services/resources 요약 (admin 전용)
  @Get('v1/admin/system/health')
  @UseGuards(JwtAuthGuard)
  async systemHealth(@Req() req: AuthedRequest) {
    if (req.user.role !== 'admin') {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, '관리자만 접근할 수 있어요.');
    }
    let db: 'ok' | 'down' = 'down';
    let redis: 'ok' | 'down' = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      db = 'ok';
    } catch {
      /* down 유지 */
    }
    try {
      if ((await this.redisClient().ping()) === 'PONG') redis = 'ok';
    } catch {
      /* down 유지 */
    }
    let pendingJobs = 0;
    let failedJobs = 0;
    try {
      const counts = await getQueues().pdf.getJobCounts('waiting', 'failed', 'delayed');
      pendingJobs = (counts['waiting'] ?? 0) + (counts['delayed'] ?? 0);
      failedJobs = counts['failed'] ?? 0;
    } catch {
      /* redis down이면 0 유지 */
    }
    const mem = process.memoryUsage();
    return {
      data: {
        build: {
          version: '0.1.0',
          gitSha: process.env.GIT_SHA ?? 'dev',
          env: env().NODE_ENV,
          region: 'local',
          nodeVersion: process.version,
          uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
        },
        services: {
          api: { status: 'ok' },
          db: { status: db },
          redis: { status: redis },
          queue: { status: redis, pendingJobs, failedJobs },
          sse: { status: 'ok' },
          aiProvider: { primary: { name: aiClient.provider, status: 'ok' }, fallback: null },
          paymentProvider: { name: 'none', status: 'down', mode: 'preparing' },
          // 실제 설정 여부 반영 — 클라이언트 ID/키가 있으면 'ok', 없으면 'preparing'.
          oauth: {
            google: { status: env().GOOGLE_CLIENT_ID ? 'ok' : 'preparing' },
            kakao: { status: env().KAKAO_REST_API_KEY ? 'ok' : 'preparing' },
          },
        },
        resources: {
          memory: { usedMB: Math.round(mem.rss / 1024 / 1024), heapMB: Math.round(mem.heapUsed / 1024 / 1024) },
          cpu: { cores: require('node:os').cpus().length },
        },
        recentErrors: [],
        recentDeploys: [],
      },
    };
  }
}
