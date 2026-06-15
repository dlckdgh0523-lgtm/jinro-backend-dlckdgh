// PDF 시나리오 — 동시 생성 spike 50건 → 큐가 흡수, 워커 OOM 없이 전부 처리되는지
// (DISABLE_RATE_LIMIT=true 프로파일에서 실행)
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { BASE, authHeaders, signupAndLogin } from './helpers.js';

const pdfDone = new Counter('pdf_done');
const pdfFailed = new Counter('pdf_failed');
const pdfWait = new Trend('pdf_wait_seconds', true);

export const options = {
  scenarios: {
    spike: {
      executor: 'per-vu-iterations',
      vus: 50,
      iterations: 1,
      maxDuration: '8m',
    },
  },
  thresholds: {
    pdf_failed: ['count==0'], // PDF 실패 0
    http_req_failed: ['rate<0.01'],
  },
};

const MESSAGES = [
  '동아리에서 영상 편집을 했는데 정말 재밌었어요',
  '친구들이 칭찬해줘요. 컷 구성을 잘해요',
  '사람들에게 도움이 되는 게 중요해요',
  '학교 축제 영상에 몰입했어요',
];

export default function () {
  const auth = signupAndLogin();
  const h = authHeaders(auth.accessToken);

  const session = http.post(`${BASE}/v1/ai-counseling/sessions`, null, h).json('data');
  for (const text of MESSAGES) {
    const r = http.post(`${BASE}/v1/ai-counseling/sessions/${session.id}/messages?stream=false`, JSON.stringify({ text }), h);
    check(r, { 'message ok': (x) => x.status === 200 });
  }

  const start = Date.now();
  const trigger = http.post(`${BASE}/v1/reports`, JSON.stringify({ sessionId: session.id }), h);
  check(trigger, { 'report queued': (r) => r.status === 202 });
  const reportId = trigger.json('data.reportId');

  // 완료 폴링 (큐 흡수 검증 — 동시 50건, 워커 동시성 1~2)
  let status = 'queued';
  for (let i = 0; i < 360 && status !== 'done' && status !== 'failed'; i++) {
    sleep(1);
    const res = http.get(`${BASE}/v1/reports/${reportId}`, h);
    if (res.status === 200) status = res.json('data.status');
  }
  pdfWait.add((Date.now() - start) / 1000);
  if (status === 'done') {
    pdfDone.add(1);
    // presigned URL 다운로드까지 검증
    const url = http.get(`${BASE}/v1/reports/${reportId}`, h).json('data.pdfUrl');
    const pdf = http.get(url.replace('http://localhost:3000', BASE).replace('http://localhost', BASE));
    check(pdf, { 'pdf magic': (r) => r.body && String(r.body).slice(0, 5) === '%PDF-' });
  } else {
    pdfFailed.add(1);
  }
}
