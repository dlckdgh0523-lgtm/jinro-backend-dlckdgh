# RUNBOOK — 주요 장애 시나리오 대응

## 0. 빠른 상태 확인
```
GET /health            # liveness
GET /ready             # db + redis
GET /v1/admin/system/health   # (admin 토큰) 큐 적체·서비스 요약
docker compose ps / docker compose logs api worker
```
로그는 pino JSON — `traceId`로 요청 단위 추적. 5xx는 전부 `unhandled error` 또는 도메인 로그와 Sentry(noop) 기록.

## 1. 커리어넷 다운 / 지연
- 증상: 로그 `careernet retry`, `careernet circuit OPEN`, 응답 `CAREERNET_UPSTREAM_TIMEOUT|UPSTREAM_ERROR|CIRCUIT_OPEN`(502/503).
- 동작 원리: 타임아웃 5s → p-retry 2회(지수백오프) → opossum 서킷(50% 실패 시 10s open). **적재(DB)된 도메인은 영향 없음** — 직업/학과/학교/상담은 DB 소스로 서빙됨.
- 대응:
  1. `GET /v1/career/jobs` meta.source가 `db`면 사용자 영향 없음. live 의존 라우트(education-materials, tests)만 5xx.
  2. 서킷은 10s 후 half-open 자동 복구. 장기 장애면 마지막 ingestion 데이터로 계속 운영.
  3. ingestion 실패는 IngestionRun(status=failed)와 DLQ(`dead-letter` 큐)에 남음 — 커리어넷 복구 후 `ingest` 큐에 잡 재투입:
     `node -e "require('./dist/jobs/queues').getQueues().ingest.add('full',{})"`

## 2. Anthropic 429 / 529 / 스트림 중단
- 증상: SSE `event: error` data `{code: AI_RATE_LIMITED|AI_OVERLOADED}`, 로그 `ai usage` 누락.
- 동작 원리: SDK maxRetries 2 내장. 스트림 중 에러는 부분 응답 저장 후 SSE error 이벤트로 종료(프로세스 무영향). 클라 disconnect 시 abort로 토큰 비용 차단.
- 대응:
  1. 단기 429는 자연 회복. 지속되면 `AI_MAX_CONCURRENT_STREAMS`(기본 50) 낮춰 동시성 줄이기.
  2. 비상 시 `AI_PROVIDER=mock`으로 전환(완전 무중단 degraded 모드) 후 재기동.
  3. 토큰 비용 이상 징후: 로그 `ai usage`의 inputTokens/outputTokens 합산 모니터링.

## 3. PDF 워커 OOM / 크래시
- 증상: worker 로그 `pdf job failed`, report.status=failed, DLQ에 `pdf-failed` 적재, SSE `event: error`.
- 동작 원리: 동시성 1(기본), 잡당 BrowserContext 격리, 20잡마다 브라우저 재시작, stalled 잡은 BullMQ가 재시도(최대 3회), 소진 시 DLQ+Sentry.
- 대응:
  1. `docker compose restart worker` — 브라우저는 재기동 시 새로 launch.
  2. 메모리 한도 확인(compose mem_limit 2g, 1.5GB 이상 유지). 동시성은 `PDF_WORKER_CONCURRENCY`(1~2)로 제한.
  3. 실패 리포트 재생성: `POST /v1/ai-counseling/sessions/:id/report` 재호출 — failed 리포트는 자동 재enqueue됨(멱등).
  4. 한글 □□□ 깨짐: vendor/fonts/Pretendard-Regular.woff2 존재 확인 (이미지 빌드 누락 여부).

## 4. Redis 끊김
- 증상: 로그 `redis error`/`redis reconnecting`, 캐시 미스 증가, SSE 신규 이벤트 유실 가능.
- 동작 원리: 캐시는 get/set 실패 시 **우회**(loader 직행) — 5xx 안 남. 알림은 DB에 영속이라 유실분은 GET /v1/notifications로 복구. BullMQ는 재연결 후 재개. SSE 버퍼/팬아웃만 일시 중단.
- 대응:
  1. `docker compose restart redis` 후 ioredis 자동 재연결 확인(`redis reconnecting` → 정상화).
  2. 재연결 후 클라 SSE는 Last-Event-ID로 누락분 수신(버퍼 60분 보관 — 그 이상 끊겼으면 목록 API로 동기화).
  3. 장시간 다운이면 PDF/적재 잡이 enqueue 실패할 수 있음 — failed 리포트는 재호출로 복구(§3-3).

## 5. DB 다운
- 증상: /ready 503 `{db:'down'}`, 대부분의 라우트 500.
- 대응: postgres 컨테이너/연결 복구가 최우선. 복구 후 별도 조치 불필요(상태는 전부 DB에).

## 6. SSE 연결 문제 (프록시 버퍼링/좀비)
- 점검: 응답 헤더 `X-Accel-Buffering: no`, `Content-Type: text/event-stream`. heartbeat 주석이 25s마다 와야 함.
- nginx 뒤에 둘 경우 `proxy_buffering off`, HTTP/1.1 + `proxy_set_header Connection ''` 필요.
- 느린 클라이언트는 적체 1MB 초과 시 서버가 연결을 끊음(메모리 보호) — 클라 재연결로 회복.

## 7. DLQ 점검/재처리
```
node -e "require('./dist/jobs/queues').getQueues().dlq.getJobs(['waiting','failed','completed'],0,50).then(js=>{js.forEach(j=>console.log(j.name,JSON.stringify(j.data)));process.exit(0)})"
```
- `pdf-failed`: 원본 데이터(reportId)로 §3-3 재생성.
- `ingest-failed`: 커리어넷 상태 확인 후 ingest 재투입(§1-3).
