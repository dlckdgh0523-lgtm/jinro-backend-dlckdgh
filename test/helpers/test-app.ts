import type { NestExpressApplication } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resetEnvForTest, loadEnv } from '../../src/common/env';
import { createMockCareernet } from '../../tools/mock-careernet';

// 통합테스트 부트 헬퍼 — 실제 Nest 앱 + 자체 mock 커리어넷.
// env는 파일 단위로 오버라이드 (testcontainers 연결 정보는 global-setup이 process.env에 주입).

export interface TestContext {
  app: NestExpressApplication;
  baseUrl: string;
  careernet: ReturnType<typeof createMockCareernet>;
  close(): Promise<void>;
}

export async function bootTestApp(envOverrides: Record<string, string> = {}): Promise<TestContext> {
  const careernet = createMockCareernet();
  const careernetPort = await careernet.listen(0);

  resetEnvForTest();
  const storageDir = mkdtempSync(join(tmpdir(), 'jinro-storage-'));
  loadEnv({
    CAREERNET_BASE_URL: `http://127.0.0.1:${careernetPort}`,
    CAREERNET_API_KEY: 'test-api-key', // mock이 inspct 계열에서 apikey 존재를 검증한다 (실 API 재현)
    ALIMI_BASE_URL: `http://127.0.0.1:${careernetPort}`, // 대학알리미 mock 라우트 공존 (키는 기본 '' → skip)
    LOCAL_STORAGE_DIR: storageDir,
    PUBLIC_BASE_URL: 'http://localhost', // 서명 URL 검증은 경로만 사용
    ...envOverrides,
  });

  // createApp은 loadEnv를 다시 부르므로 import 순서 주의 — 여기서 동적 import
  const { createApp } = await import('../../src/main');
  const app = await createApp();
  await app.listen(0, '127.0.0.1');
  const url = await app.getUrl();
  const baseUrl = url.replace('[::1]', '127.0.0.1');

  return {
    app,
    baseUrl,
    careernet,
    async close() {
      await app.close();
      await careernet.close();
      const { closeQueues } = await import('../../src/jobs/queues');
      await closeQueues();
    },
  };
}

export interface TestUser {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; role: string };
}

export async function signupStudent(baseUrl: string, overrides: Record<string, unknown> = {}): Promise<TestUser> {
  const res = await fetch(`${baseUrl}/v1/auth/signup/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `t-${randomUUID()}@test.kr`,
      password: 'password123!',
      name: '테스트학생',
      consents: { tos: true, privacy: true, academic: true, ai: true, age: true },
      ...overrides,
    }),
  });
  if (!res.ok) throw new Error(`signup failed ${res.status}: ${await res.text()}`);
  return (await res.json()) as TestUser;
}

export async function api(
  baseUrl: string,
  token: string | null,
  method: string,
  path: string,
  body?: unknown,
): Promise<{ status: number; json: any }> {
  const res = await fetch(baseUrl + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* 비 JSON 응답 */
  }
  return { status: res.status, json };
}

/** SSE 스트림 리더 — fetch 기반, 이벤트 배열 수집 */
export interface SseEvent {
  id?: string;
  event: string;
  data: any;
}

export async function readSse(
  url: string,
  opts: { method?: string; token?: string; body?: unknown; lastEventId?: string; maxEvents?: number; timeoutMs?: number; stopOn?: (ev: SseEvent) => boolean },
): Promise<SseEvent[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? 20_000);
  const events: SseEvent[] = [];
  try {
    const res = await fetch(url, {
      method: opts.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
        ...(opts.lastEventId ? { 'Last-Event-ID': opts.lastEventId } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok || !res.body) throw new Error(`sse failed ${res.status}: ${await res.text()}`);
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (frame.startsWith(':')) continue; // heartbeat 주석
        const ev: SseEvent = { event: 'message', data: null };
        const dataLines: string[] = [];
        for (const line of frame.split('\n')) {
          if (line.startsWith('id: ')) ev.id = line.slice(4);
          else if (line.startsWith('event: ')) ev.event = line.slice(7);
          else if (line.startsWith('data: ')) dataLines.push(line.slice(6));
        }
        if (dataLines.length) {
          const raw = dataLines.join('\n');
          try {
            ev.data = JSON.parse(raw);
          } catch {
            ev.data = raw;
          }
        }
        events.push(ev);
        if (opts.stopOn?.(ev) || (opts.maxEvents && events.length >= opts.maxEvents)) {
          controller.abort();
          return events;
        }
      }
    }
    return events;
  } catch (e) {
    if ((e as Error).name === 'AbortError') return events;
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}
