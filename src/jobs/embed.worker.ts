import { Worker } from 'bullmq';
import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { embedBatch, toVectorLiteral } from '../ai/embedding';
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
      if (jobs.length) {
        const vecs = await embedBatch(jobs.map((j) => `${j.name} ${j.summary ?? ''} ${j.aptitude ?? ''}`));
        for (let i = 0; i < jobs.length; i++) {
          await prisma.$executeRaw(Prisma.sql`UPDATE "CareerJob" SET "embedding" = ${toVectorLiteral(vecs[i]!)}::vector WHERE "seq" = ${jobs[i]!.seq}`);
          total += 1;
        }
      }

      const majors = await prisma.$queryRaw<{ majorSeq: number; name: string; summary: string | null }[]>(
        Prisma.sql`SELECT "majorSeq", "name", "summary" FROM "Major" WHERE "embedding" IS NULL LIMIT 2000`,
      );
      if (majors.length) {
        const vecs = await embedBatch(majors.map((m) => `${m.name} ${m.summary ?? ''}`));
        for (let i = 0; i < majors.length; i++) {
          await prisma.$executeRaw(Prisma.sql`UPDATE "Major" SET "embedding" = ${toVectorLiteral(vecs[i]!)}::vector WHERE "majorSeq" = ${majors[i]!.majorSeq}`);
          total += 1;
        }
      }

      const cases = await prisma.$queryRaw<{ seq: number; title: string; question: string | null }[]>(
        Prisma.sql`SELECT "seq", "title", "question" FROM "CounselCase" WHERE "embedding" IS NULL LIMIT 2000`,
      );
      if (cases.length) {
        const vecs = await embedBatch(cases.map((c) => `${c.title} ${c.question ?? ''}`));
        for (let i = 0; i < cases.length; i++) {
          await prisma.$executeRaw(Prisma.sql`UPDATE "CounselCase" SET "embedding" = ${toVectorLiteral(vecs[i]!)}::vector WHERE "seq" = ${cases[i]!.seq}`);
          total += 1;
        }
      }

      logger.info({ total }, 'embedding done');
      return { total };
    },
    { connection: createBullRedis(), concurrency: 1 },
  );

  worker.on('failed', (job, err) => logger.error({ jobId: job?.id, err: err.message }, 'embed job failed'));
  return worker;
}
