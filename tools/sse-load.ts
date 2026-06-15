// SSE 부하 생성기 (Node) — AI 스트리밍 동시연결 ramp (예: 50→500)
// xk6-sse는 POST 스트림(AI 메시지) 시나리오를 못 다뤄 Node로 측정한다 (DECISIONS #24).
// 측정: 연결 성공률, TTFT(first token), 스트림 완료율, 드롭(중간 끊김/error 이벤트), e2e 시간.
//
// 사용: BASE_URL=http://localhost:3000 RAMP=50,150,300,500 STEP_SEC=30 npx tsx tools/sse-load.ts

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const RAMP = (process.env.RAMP || '50,150,300,500').split(',').map(Number);
const STEP_SEC = Number(process.env.STEP_SEC || 30);

interface StreamResult {
  ok: boolean;
  dropped: boolean;
  ttftMs: number | null;
  totalMs: number;
  tokens: number;
  error?: string;
}

function pct(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))]!;
}

async function signup(): Promise<{ token: string; sessionId: string }> {
  const res = await fetch(`${BASE}/v1/auth/signup/student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `sse-${Date.now()}-${Math.random().toString(36).slice(2)}@load.kr`,
      password: 'loadtest123!',
      name: 'SSE부하',
      consents: { tos: true, privacy: true, academic: true, ai: true, age: true },
    }),
  });
  if (res.status !== 201) throw new Error(`signup ${res.status}`);
  const auth = (await res.json()) as { accessToken: string };
  const s = await fetch(`${BASE}/v1/ai-counseling/sessions`, { method: 'POST', headers: { Authorization: `Bearer ${auth.accessToken}` } });
  const session = (await s.json()) as { data: { id: string } };
  return { token: auth.accessToken, sessionId: session.data.id };
}

async function oneStream(creds: { token: string; sessionId: string }): Promise<StreamResult> {
  const start = Date.now();
  let ttftMs: number | null = null;
  let tokens = 0;
  try {
    const res = await fetch(`${BASE}/v1/ai-counseling/sessions/${creds.sessionId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${creds.token}`, Accept: 'text/event-stream' },
      body: JSON.stringify({ text: '영상 편집이 재밌어요. 진로 상담 부탁해요.' }),
    });
    if (res.status !== 200 || !res.body) {
      return { ok: false, dropped: false, ttftMs: null, totalMs: Date.now() - start, tokens: 0, error: `http ${res.status}` };
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let done = false;
    let errored = false;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buf += decoder.decode(chunk.value, { stream: true });
      let idx: number;
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (frame.includes('event: token')) {
          tokens += 1;
          if (ttftMs === null) ttftMs = Date.now() - start;
        } else if (frame.includes('event: done')) {
          done = true;
        } else if (frame.includes('event: error')) {
          errored = true;
        }
      }
    }
    return { ok: done && !errored, dropped: !done && !errored, ttftMs, totalMs: Date.now() - start, tokens, error: errored ? 'sse error event' : undefined };
  } catch (e) {
    return { ok: false, dropped: true, ttftMs, totalMs: Date.now() - start, tokens, error: (e as Error).message };
  }
}

async function runStep(concurrency: number): Promise<void> {
  process.stdout.write(`\n[step] concurrency=${concurrency} for ${STEP_SEC}s\n`);
  // 사용자 풀 준비 (연결당 1세션 재사용 — 메시지 누적 방지 위해 1/4 지점마다 새 유저)
  const poolSize = Math.max(10, Math.floor(concurrency / 4));
  const pool: { token: string; sessionId: string }[] = [];
  for (let i = 0; i < poolSize; i++) pool.push(await signup());

  const results: StreamResult[] = [];
  const deadline = Date.now() + STEP_SEC * 1000;
  let active = 0;
  let launched = 0;

  await new Promise<void>((resolve) => {
    const pump = () => {
      while (active < concurrency && Date.now() < deadline) {
        active += 1;
        launched += 1;
        const creds = pool[launched % pool.length]!;
        void oneStream(creds).then((r) => {
          results.push(r);
          active -= 1;
          if (Date.now() >= deadline && active === 0) resolve();
          else pump();
        });
      }
      if (Date.now() >= deadline && active === 0) resolve();
    };
    pump();
    const guard = setInterval(() => {
      if (Date.now() >= deadline && active === 0) {
        clearInterval(guard);
        resolve();
      }
    }, 500);
  });

  const ok = results.filter((r) => r.ok).length;
  const dropped = results.filter((r) => r.dropped).length;
  const errors = results.filter((r) => !r.ok && !r.dropped).length;
  const ttfts = results.map((r) => r.ttftMs).filter((v): v is number => v !== null).sort((a, b) => a - b);
  const totals = results.map((r) => r.totalMs).sort((a, b) => a - b);
  const errSamples = [...new Set(results.filter((r) => r.error).map((r) => r.error))].slice(0, 3);
  console.log(
    JSON.stringify({
      concurrency,
      streams: results.length,
      completed: ok,
      dropped,
      rejected: errors,
      throughputPerSec: Math.round((results.length / STEP_SEC) * 10) / 10,
      ttftMs: { p50: pct(ttfts, 50), p95: pct(ttfts, 95), p99: pct(ttfts, 99) },
      totalMs: { p50: pct(totals, 50), p95: pct(totals, 95), p99: pct(totals, 99) },
      errSamples,
    }),
  );
}

async function main(): Promise<void> {
  console.log(`SSE load against ${BASE}, ramp=${RAMP.join('→')}, step=${STEP_SEC}s`);
  for (const c of RAMP) {
    await runStep(c);
  }
  console.log('\nsse-load done');
}

void main().catch((e) => {
  console.error('sse-load failed:', (e as Error).message);
  process.exit(1);
});
