import { execSync } from 'node:child_process';
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';

// testcontainers로 실제 postgres(pgvector)+redis를 1회 기동 (미션 P6).
// 외부(커리어넷·Anthropic·S3)는 전부 mock — 각 테스트 파일이 자체 mock 커리어넷을 띄운다.

let pg: StartedPostgreSqlContainer;
let redis: StartedTestContainer;

export async function setup(): Promise<void> {
  [pg, redis] = await Promise.all([
    new PostgreSqlContainer('pgvector/pgvector:pg16').withDatabase('jinro_test').withUsername('jinro').withPassword('jinro').start(),
    new GenericContainer('redis:7-alpine').withExposedPorts(6379).start(),
  ]);

  process.env.DATABASE_URL = pg.getConnectionUri();
  process.env.REDIS_URL = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;
  process.env.NODE_ENV = 'test';
  process.env.AI_PROVIDER = 'mock';
  process.env.JWT_SECRET = 'test-secret-0123456789abcdefghij';
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'silent'; // 디버깅 시 LOG_LEVEL=error + LOG_FILE로 캡처

  execSync('npx prisma migrate deploy', { env: { ...process.env }, stdio: 'pipe' });
  // 테스트 워커가 물려받도록 redis 포트도 노출
  process.env.TEST_REDIS_PORT = String(redis.getMappedPort(6379));
}

export async function teardown(): Promise<void> {
  await Promise.allSettled([pg?.stop(), redis?.stop()]);
}
