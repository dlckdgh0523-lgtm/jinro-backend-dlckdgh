import { Queue } from 'bullmq';
import { createBullRedis } from '../common/redis';

// BullMQ = 내구성 잡 전용 (PDF, ingestion, embedding). SSE 아님, raw Streams 직접 사용 금지.
// 모든 큐 공통: 재시도 3회 + 지수 backoff + removeOnComplete + DLQ (DECISIONS #18).

export const QUEUE_NAMES = {
  pdf: 'pdf',
  ingest: 'ingest',
  embed: 'embed',
  dlq: 'dead-letter',
} as const;

export const DEFAULT_JOB_OPTS = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 2_000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 500 },
};

interface QueueSet {
  pdf: Queue;
  ingest: Queue;
  embed: Queue;
  dlq: Queue;
}

let queues: QueueSet | null = null;

export function getQueues(): QueueSet {
  if (!queues) {
    const connection = createBullRedis();
    queues = {
      pdf: new Queue(QUEUE_NAMES.pdf, { connection, defaultJobOptions: DEFAULT_JOB_OPTS }),
      ingest: new Queue(QUEUE_NAMES.ingest, { connection, defaultJobOptions: DEFAULT_JOB_OPTS }),
      embed: new Queue(QUEUE_NAMES.embed, { connection, defaultJobOptions: DEFAULT_JOB_OPTS }),
      dlq: new Queue(QUEUE_NAMES.dlq, { connection, defaultJobOptions: { removeOnComplete: false, removeOnFail: false } }),
    };
  }
  return queues;
}

export async function closeQueues(): Promise<void> {
  if (!queues) return;
  await Promise.allSettled(Object.values(queues).map((q) => q.close()));
  queues = null;
}
