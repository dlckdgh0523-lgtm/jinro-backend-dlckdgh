# PRD — 진로나침반 백엔드 (jinro-back)

## 1. 목적
커리어넷 Open API(공공, v4.1) 기반 AI 진로상담 웹서비스 "진로나침반"의 백엔드.
프론트(../jinro-front)가 정의한 계약(backend-integration.md, app-runtime.jsx)을 만족시키는 것이 1차 목표.

## 2. 백엔드의 책임 (정확히 3가지 + 전제 인프라)
1. **커리어넷 프록시·정규화·캐시** — apiKey 서버 은닉, EUC-KR/JSON 두 계열 흡수, dirty data 정제,
   Redis 캐시 + single-flight, cron ingestion으로 자체 PostgreSQL 적재(런타임의 커리어넷 직접 의존 제거).
2. **AI 진로상담** — Claude(Haiku 라우팅/추출 + Sonnet 합성, prompt caching) + RAG(pgvector+tsvector 하이브리드),
   SSE 토큰 스트리밍, 단서(Signal) 추출과 evidence 기반 진행도, 잠정 가설 리포트 합성.
3. **PDF 리포트** — BullMQ 워커에서 Playwright 렌더(한글 폰트 임베드, 차트 시그널 대기),
   스토리지 저장 후 presigned URL 반환, 멱등키·DLQ.

전제 인프라: JWT 인증(가입/로그인/refresh 회전), 알림 SSE(dedupeKey, Last-Event-ID 재전송), 입시 조회(적재 데이터 기반), 헬스체크.

## 3. 비기능 요구
- **보안**: apiKey/비밀키 서버 env 전용, bcrypt, JWT 15분/refresh 14일 회전, CORS 화이트리스트,
  서명 URL(HMAC) 파일 접근, 만 14세 미만 가입 차단, NUL 바이트 등 입력 정제.
- **레이트리밋**: 전역 100/min, 로그인 5/min/IP, AI 30/min, AI 동시 스트림 상한(인스턴스당 50), 바디 100KB.
- **회복탄력성**: 타임아웃 5s + p-retry 지수백오프 + opossum 서킷. 외부 장애 시 표준 에러 또는 DB 폴백, 프로세스 불사.
- **관측성**: pino 구조화 로그 + traceId(AsyncLocalStorage), Sentry(키 없으면 no-op), /health /ready, admin 시스템 헬스.
- **에러 규약**: `{ code, message, traceId, details?, error:{code,message,traceId} }` — 내부 스택 비노출.
- **성능 목표**: REST p95 < 300ms(캐시/DB 경로), 에러율 < 1%, SSE drop 0, PDF 실패 0 (LOAD_TEST_REPORT.md).

## 4. 외부 의존
| 의존 | 용도 | 키 부재 시 |
|---|---|---|
| 커리어넷 Open API v4.1 | 직업/학과/학교/상담사례/교육자료/검사 | mock 서버(fixture, EUC-KR 재현) — CAREERNET_BASE_URL 전환 |
| Anthropic API | Haiku(추출)/Sonnet(합성) 스트리밍 | AI_PROVIDER=mock 고정 토큰 스트림 + 규칙 기반 추출 |
| AWS S3 | PDF 저장 | 로컬 스토리지 + HMAC 서명 URL |
| Sentry | 에러 수집 | no-op 로거 |

## 5. 범위 제외 (차기 — FRONTEND_CONTRACT.md "차기 범위")
성적, 메시지/상담예약, 캘린더, 결제/구독(PG 미계약 — fake success 금지 원칙), 어드민 전체, 피드백,
OAuth 콜백, 비밀번호 재설정 메일, 검사 문항 제출/리포트 프록시.
