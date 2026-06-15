import { Worker } from 'bullmq';
import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { embed, toVectorLiteral } from '../ai/embedding';
import { createBullRedis } from '../common/redis';
import { logger } from '../common/logger';
import { QUEUE_NAMES } from './queues';

// 임베딩 워커 — 적재된 직업/학과/상담사례 중 embedding이 비어 있는 행을 채운다.

export function startEmbedWorker(prisma: PrismaClient): Worker {
  const worker = new Worker(
    QUEUE_NAMES.embed,
    async () => {
      let total = 0;

      const jobs = await prisma.$queryRaw<{ seq: number; name: string; summary: string | null; aptitude: string | null }[]>(
        Prisma.sql`SELECT "seq", "name", "summary", "aptitude" FROM "CareerJob" WHERE "embedding" IS NULL LIMIT 2000`,
      );
      for (const j of jobs) {
        const vec = toVectorLiteral(embed(`${j.name} ${j.summary ?? ''} ${j.aptitude ?? ''}`));
        await prisma.$executeRaw(Prisma.sql`UPDATE "CareerJob" SET "embedding" = ${vec}::vector WHERE "seq" = ${j.seq}`);
        total += 1;
      }

      const majors = await prisma.$queryRaw<{ majorSeq: number; name: string; summary: string | null }[]>(
        Prisma.sql`SELECT "majorSeq", "name", "summary" FROM "Major" WHERE "embedding" IS NULL LIMIT 2000`,
      );
      for (const m of majors) {
        const vec = toVectorLiteral(embed(`${m.name} ${m.summary ?? ''}`));
        await prisma.$executeRaw(Prisma.sql`UPDATE "Major" SET "embedding" = ${vec}::vector WHERE "majorSeq" = ${m.majorSeq}`);
        total += 1;
      }

      const cases = await prisma.$queryRaw<{ seq: number; title: string; question: string | null }[]>(
        Prisma.sql`SELECT "seq", "title", "question" FROM "CounselCase" WHERE "embedding" IS NULL LIMIT 2000`,
      );
      for (const c of cases) {
        const vec = toVectorLiteral(embed(`${c.title} ${c.question ?? ''}`));
        await prisma.$executeRaw(Prisma.sql`UPDATE "CounselCase" SET "embedding" = ${vec}::vector WHERE "seq" = ${c.seq}`);
        total += 1;
      }

      logger.info({ total }, 'embedding done');
      return { total };
    },
    { connection: createBullRedis(), concurrency: 1 },
  );

  worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err: err.message }, 'embed job failed'));
  return worker;
}
