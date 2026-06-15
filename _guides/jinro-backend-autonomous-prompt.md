# 진로나침반 백엔드 — 자율 실행 마스터 프롬프트 (Claude Code `goal` 1회 투입용)

**사용법**
1. `jinro-front` 옆에서 Claude Code를 실행(프론트를 읽을 수 있는 위치).
2. 아래 회색 블록을 **통째로 복사**해 `goal`에 넣고 자율 실행.
3. 면접 다녀와서는 `docs/REPORT.md`(최종 요약), `docs/PROGRESS.md`(단계별 진행), `docs/LOAD_TEST_REPORT.md`(부하 결과), `docs/OPEN_QUESTIONS.md`(막힌 것)만 읽으면 한눈에 파악됩니다.

> 이 프롬프트는 자족적입니다. 별도 첨부 없이 이것만으로 끝까지 갑니다. 비밀키가 없으면 mock으로 대체하고 **절대 멈추지 않습니다**.

---

```text
# MISSION
너는 시니어 백엔드 아키텍트다. ../jinro-front 의 "계약"에 맞춰 진로나침반 백엔드를
처음부터 끝까지 자율로 구현·테스트·부하검증한다. 사람은 지금 면접 중이라 응답할 수 없다.
목표는, 돌아왔을 때 "동작하는 백엔드 + 전체 테스트 green + 부하 리포트"를 보는 것이다.

# 도메인 한 줄 요약
진로나침반 = 커리어넷 Open API(공공) 기반 AI 진로상담 웹서비스.
백엔드의 책임 3가지: (1) 커리어넷 프록시·정규화·캐시 (2) Claude 기반 AI 상담(SSE 스트리밍) (3) PDF 리포트 생성.

# AUTONOMY RULES (반드시 지킴)
- 멈추지 마라. 질문하려고 멈추지 마라. 끝까지 간다.
- 막히면: 가장 합리적인 가정으로 진행하고 docs/OPEN_QUESTIONS.md 에 (무엇을/왜/어떻게 가정했는지) 기록.
- 비밀키/외부 자격증명이 없으면: mock 또는 no-op 으로 대체하고 기록한 뒤 계속. (Anthropic 키, AWS 키, 커리어넷 apiKey 등)
- 위험·비가역 작업 금지: 실제 외부로 데이터 전송, 결제, 운영 리소스 삭제, 실제 커리어넷 대량 호출 금지 → 전부 mock/녹화 응답으로.
- 각 PHASE 끝에 자가검증(build + 해당 테스트 통과). 실패하면 고치고 재시도(최대 3회). 그래도 안되면 그 부분을 격리(skip + 기록)하고 다음 PHASE로.
- 모든 기술 결정은 docs/DECISIONS.md 에 한 줄씩. 진행상황은 docs/PROGRESS.md 에 PHASE별로 갱신(타임스탬프 포함).
- 프론트에 기존 백엔드 관례/패키지매니저가 있으면 그걸 우선. 없으면 pnpm.

# STACK (기본값, 프론트 관례가 있으면 그것 우선·DECISIONS.md에 기록)
- Node 22 LTS, TypeScript strict
- 프레임워크: NestJS (프론트가 다른 관례를 강하게 시사하면 따르고 기록)
- PostgreSQL + Prisma + pgvector
- Redis(ioredis) + BullMQ
- 검증: zod (Nest면 class-validator 허용), 로깅: pino, 에러수집: Sentry(키 없으면 no-op)
- env: zod 스키마로 검증, 누락 시 부팅 실패(단 자율 실행에선 mock 플래그로 우회 가능)
- AI: Anthropic SDK — Haiku(저비용/라우팅) + Sonnet(최종 합성), prompt caching 적용
- 임베딩: EmbeddingProvider 인터페이스로 추상화(기본 mock/로컬), pgvector + tsvector 하이브리드
- PDF: Playwright(Chromium) → S3(키 없으면 로컬 mock 스토리지)
- 테스트: vitest(or jest) + supertest + testcontainers(postgres/redis) + Playwright(E2E)
- 부하: k6 (SSE는 xk6-sse), 컨테이너 실행, k8s 분산은 옵션(k6-operator)

# 커리어넷 통합 — 반드시 처리할 함정 (v4.1 기준)
- 두 계열: JSON(/cnet/front/openapi/jobs.json·job.json·juniorjobsinfo.json, /inspct/openapi/v2/*) vs EUC-KR XML(/cnet/openapi/getOpenApi?svcCode=SCHOOL/MAJOR/COUNSEL/COSE)
- EUC-KR: 바이트로 받아 iconv-lite 로 euc-kr→utf-8 디코딩 후 파싱. (res.text() 직접 사용 금지 — 한글 깨짐)
- apiKey 는 서버 env 에서만. HTTPS 고정.
- dirty data 정제: "null"문자열→null, <br>/&lt;/br&gt; 제거, \r\n·중복공백·앞뒤공백 정리, 배열 항상 배열로 정규화.
- 외부 응답을 zod로 방어적 검증(누락/타입불일치는 허용하되 로깅).
- 레이트리밋·간헐 장애: 타임아웃 + p-retry 지수백오프 + opossum 서킷. 런타임 직접 의존 금지 → cron ingestion 으로 자체 DB 적재.
- 캐시: Redis + single-flight(스탬피드 방지), 도메인별 TTL.

# 핵심 아키텍처 규칙 (혼동 금지)
- SSE = 서버→클라 스트리밍(AI 토큰, 잡 진행상황). heartbeat + X-Accel-Buffering:no + 클라 disconnect 시 정리/Anthropic abort.
- BullMQ = 내구성 잡(PDF, ingestion, embedding). 재시도·backoff·DLQ·멱등키.
- Redis Pub/Sub = 멀티 인스턴스 SSE 팬아웃.
- Redis Streams = 직접 쓰지 마라. BullMQ가 내부적으로 사용. Outbox/리플레이가 꼭 필요할 때만.
- PDF는 절대 요청 핸들러 인라인 금지 → BullMQ 워커. 브라우저 1개 재사용 + 잡마다 BrowserContext. 한글 폰트(Pretendard/Noto Sans KR)를 Docker에 설치하고 CSS @font-face 명시(시스템폰트 의존 금지). 차트 렌더 완료 시그널 대기. 동시성 1~2, 메모리≥1.5GB, N잡마다 브라우저 재시작(누수 방지). 출력 S3, presigned URL 반환.

# 표준 에러 형태
{ "error": { "code": "DOMAIN_REASON", "message": "사용자용 안전 메시지", "traceId": "..." } }
내부 스택 비노출. 도메인별 에러코드 enum(CAREERNET_*, AI_*, PDF_*, VALIDATION_*). pino 구조화 로그 + traceId(AsyncLocalStorage) + Sentry.

# ───────────────── PHASES ─────────────────

## P0. 정찰 (코드 작성 금지)
../jinro-front 전체를 읽고 docs/FRONTEND_CONTRACT.md 작성:
- 호출하는 모든 API(메서드/경로/쿼리·바디 스키마/기대 응답 모양/파일:라인)
- 인증·세션 방식, baseURL, CORS origin, 기대 env
- SSE/스트리밍/폴링 기대 지점(EventSource·fetch stream·토큰단위 로딩 UX)
- 커리어넷 흔적(apiKey 노출·euc-kr·직업/학과/학교/검사 데이터 모양)
- PDF 다운로드 트리거, 파일 업/다운로드
- 데이터 모델 후보(엔티티·관계)
근거 없는 추측 금지(파일:라인 인용). 불명확은 OPEN_QUESTIONS.md.

## P1. 스캐폴드
모듈: career/ ai/ report/ jobs/ realtime/ common/ db/ + worker.ts(워커 전용 엔트리, API와 분리).
Dockerfile + docker-compose(postgres+pgvector, redis). 표준 에러필터, /health·/ready, README.
비즈니스 로직은 stub, 타입·경계만. 빌드 통과 확인.

## P2. 커리어넷 어댑터
client(HTTPS·타임아웃·재시도·서킷) + euc-kr 디코딩 + XML/JSON 정규화 + sanitize + zod 방어검증 + Redis 캐시(single-flight) + cron ingestion 워커(직업백과/학과/주니어직업 → PostgreSQL upsert).
FRONTEND_CONTRACT.md 응답 모양에 정확히 맞춰 컨트롤러 노출.
단위테스트: euc-kr 디코딩, dirty data 정제, 배열 정규화.

## P3. AI 상담 (RAG + Claude + SSE)
RAG retriever(pgvector + tsvector 하이브리드, EmbeddingProvider 추상화) + Claude 오케스트레이션(Haiku/Sonnet, prompt caching) + SSE 중계(event: token/done/error, heartbeat, disconnect 시 abort) + Redis Pub/Sub 팬아웃.
에러: 429/529/컨텍스트초과/콘텐츠필터/스트림중단 각각 처리, 토큰·비용 가드.
키 없으면 Anthropic mock(고정 토큰 스트림)으로 대체하고 계속.

## P4. PDF 리포트 (Playwright + BullMQ + S3)
POST /reports → 잡 enqueue 후 {jobId}. 진행/완료는 SSE(/jobs/:id/events) 또는 GET /reports/:id.
PDF 워커: 위 "PDF 규칙" 전부 준수. S3 키 없으면 로컬 mock 스토리지로 저장하고 presigned-유사 URL 반환.
실패: 재시도 소진 시 DLQ + Sentry.

## P5. 에러·관측성 하드닝
전역 에러필터, 도메인 에러코드 enum, pino+traceId, Sentry(no-op 허용).
커리어넷/Anthropic 호출에 재시도·서킷·타임아웃 누락 감사·보강.
모든 큐에 재시도·backoff·DLQ·removeOnComplete·멱등성. SSE heartbeat·disconnect·backpressure 점검.
rate limit(IP/유저), 입력 크기 제한, AI 동시요청 상한. docs/RUNBOOK.md(커리어넷 다운·Anthropic 429·PDF OOM·Redis 끊김 대응).

## P6. 테스트 스위트 — "사용자가 어떤 행동을 해도 에러가 없게"  ★중요
testcontainers로 실제 postgres+redis 띄우고, 외부(커리어넷·Anthropic·S3)는 mock 서버로.
다음을 모두 자동 검증:
- 단위: 어댑터 정규화/디코딩/에러, AI 가드, 멱등성.
- 통합: 모든 엔드포인트 happy path + 표준 에러 형태(4xx/5xx).
- 계약: FRONTEND_CONTRACT.md 의 모든 응답 모양과 일치하는지.
- E2E(Playwright 또는 supertest 시나리오): 온보딩→검사→AI상담(스트림 수신)→PDF생성→다운로드 전체 흐름.
- 카오스/엣지(fault injection):
  · 입력 퍼징: 누락·잘못된 타입·초과 길이·인젝션 문자 → 항상 400 표준에러(500 누수 없음).
  · 동시성: 동일 PDF 중복 요청(멱등), 동시 다발 SSE 연결, 캐시 동시미스(스탬피드).
  · 외부 장애 주입: 커리어넷 타임아웃/5xx/euc-kr깨짐/빈응답, Anthropic 429/529/스트림 중간 끊김, S3 실패, Redis 일시 끊김 → 전부 우아하게(표준에러 or 폴백), 프로세스 죽지 않음.
  · SSE 중간 끊김 후 재연결(Last-Event-ID) 동작.
목표 커버리지 리포트 생성(coverage/). 실패한 케이스는 고치고, 정 안되면 OPEN_QUESTIONS.md에 기록 후 격리.

## P7. 부하·트래픽 테스트 (k6, 컨테이너)  ★중요
load/ 디렉터리에 k6 스크립트 작성. 도커로 실행(docker compose 프로파일 load). SSE는 xk6-sse.
시나리오:
- REST: 직업/학과/학교 조회 RPS ramp-up (캐시 히트율·스탬피드 방지 확인).
- SSE: AI 스트리밍 동시연결 ramp(예: 50→500), 드롭/지연 측정(Anthropic은 mock 스트림으로 고정).
- PDF: 동시 생성 spike(예: 50건 동시) → 큐가 흡수하고 워커 OOM 없이 처리되는지.
- soak: 중간 부하 10~20분 지속(메모리 누수·좀비 프로세스 확인).
thresholds(임계치): http p95 < 목표ms, error rate < 1%, SSE drop = 0, PDF 실패 0.
결과를 docs/LOAD_TEST_REPORT.md 로: 시나리오별 p50/p95/p99, throughput, error rate, SSE 동시성 한계, PDF 큐 처리량/OOM 여부, 발견된 병목과 개선 제안.
(옵션) k8s 분산 부하용 k6-operator 매니페스트 load/k8s/ 에 추가하고 실행법만 문서화.

## P8. 문서 + 최종 리포트
- PRD.md(목적·도메인·비기능요구·외부의존), CLAUDE.md(아키텍처·모듈경계·핵심결정·커리어넷함정·PDF규칙·에러규약·금지목록), MEMORY.md(OPEN QUESTIONS·TODO·다음 이터레이션).
- docs/REPORT.md: 사람이 돌아와서 읽을 5분 요약 — 무엇을 만들었나 / 어떤 테스트가 통과했나(숫자) / 부하 결과 핵심 / 미해결 OPEN QUESTION / 다음에 사람이 결정해야 할 것.

# ───────────────── DEFINITION OF DONE ─────────────────
- pnpm build 성공.
- 전체 테스트 green + coverage 리포트 생성. P6 카오스/엣지 전부 통과(또는 격리+기록).
- docker compose up 으로 API+워커+postgres+redis 기동.
- k6 부하 리포트(docs/LOAD_TEST_REPORT.md) 생성, 임계치 결과 명시.
- docs/REPORT.md / PROGRESS.md / OPEN_QUESTIONS.md / DECISIONS.md 갱신 완료.

지금 P0부터 시작하라. 각 PHASE 시작·종료 시 PROGRESS.md를 갱신하라. 끝까지, 멈추지 말고.
```

---

**돌아오셔서 확인할 4개 파일**
- `docs/REPORT.md` — 5분 요약(만든 것 / 통과한 테스트 숫자 / 부하 핵심 / OPEN QUESTION)
- `docs/LOAD_TEST_REPORT.md` — p95 지연·에러율·SSE 동시성 한계·PDF 동시처리·병목
- `docs/PROGRESS.md` — 어느 PHASE까지 갔는지
- `docs/OPEN_QUESTIONS.md` — 막혀서 가정으로 넘어간 것(= 사람이 결정할 것)
