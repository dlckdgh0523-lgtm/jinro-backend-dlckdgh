# REPORT.md — 5분 요약 (자율 빌드 최종 보고)

> 2026-06-12, 자율 마스터 프롬프트(Phase A) 1회 실행으로 P0~P8 완주.
> 읽는 순서: 이 문서 → docs/LOAD_TEST_REPORT.md → docs/OPEN_QUESTIONS.md → docs/PROGRESS.md.

## 1. 무엇을 만들었나
**NestJS 11 + TS strict 백엔드** — 미션의 3책임 + 전제 인프라:

| 영역 | 내용 |
|---|---|
| 커리어넷 프록시 | JSON + **EUC-KR XML(바이트→iconv-lite)** 두 계열, dirty data 정제("null"/`<br>`/`\r\n`/배열정규화), zod 방어검증, 타임아웃+p-retry+서킷, Redis 캐시+single-flight, **cron ingestion → PostgreSQL 적재**(런타임의 커리어넷 직접 의존 제거, `meta.source: db|live`) |
| AI 상담 | 세션/대화 영속, 단서(Signal) 추출 → **evidence 기반 completeness**, RAG(pgvector+tsvector+LIKE 폴백, RRF), Claude 오케스트레이션(Haiku/Sonnet+prompt caching — 키 부재 시 mock 스트림), **SSE 토큰 스트리밍**(token/done/error, heartbeat, disconnect 시 abort, GET /stream 재수신+Last-Event-ID), 잠정 가설 리포트 합성(항상 disclaimer) |
| PDF 리포트 | POST /v1/reports → BullMQ enqueue {jobId}, **Playwright 워커**(브라우저 1개 재사용+잡당 컨텍스트, Pretendard base64 임베드, SVG 차트+`__chartReady` 대기, 20잡마다 재시작, 동시성 1), 멱등키+동시중복 레이스 처리, DLQ+Sentry, 로컬 스토리지+HMAC presigned-유사 URL |
| 인프라 | JWT(15분/refresh 14일 회전), 알림(**dedupeKey 멱등**+SSE+Last-Event-ID 재전송 버퍼), 입시 조회(적재 데이터, 미보유 수치는 `confidence:'unavailable'`), 표준 에러(병합 형태), traceId(ALS)+pino, rate limit, Docker compose 전체 스택 |

프론트 계약은 `docs/FRONTEND_CONTRACT.md`로 역추출(파일:라인 근거) — **에러 형태 충돌 발견·해소**(프론트는 최상위 `code/message`를 읽음 → 병합 형태로 둘 다 충족).

## 2. 어떤 테스트가 통과했나 (숫자)
- **83/83 green** (vitest, 13파일) + `coverage/` (statements **83.9%**, functions 89.0%)
- 단위 33: euc-kr 디코딩(res.text() 깨짐 증명 포함), dirty data 정제, 배열 정규화, AI 가드(abort/컨텍스트 상한), 시그널 규칙, 임베딩 결정성, 서명 URL, 캐시 강등
- 통합 50 (**testcontainers 실제 pg+redis**, 외부는 mock):
  - 계약: FRONTEND_CONTRACT 응답 모양 zod 고정 (인증/커리어/상담/알림/입시/헬스)
  - E2E: 가입→검사→AI 스트림 5회→리포트→**실제 Playwright PDF 렌더→다운로드→위조 서명 거부**
  - 동시성: 동일 PDF 10건 동시 → 단일 reportId(멱등), 캐시 동시미스 20건 → upstream **1회**(스탬피드 방지), SSE 30연결 팬아웃
  - 장애 주입: 커리어넷 타임아웃/500/빈응답/깨진 바이트 → 전부 CAREERNET_* 표준에러+프로세스 생존, Redis 불능 → 캐시 우회
  - SSE 재연결: Last-Event-ID로 누락분 재전송 (알림 + AI 토큰 재개 둘 다)
  - 퍼징: 인젝션/NUL/타입오류/초과길이 → 4xx 표준에러, **500 누수 0**
- 퍼징이 잡아낸 **실제 버그 3건 수정**: int32 오버플로 500, body-parser 에러 매핑(413/400), NUL 바이트→PG 22021 500

## 3. 부하 결과 핵심 (상세: docs/LOAD_TEST_REPORT.md)
| 시나리오 | 결과 | 임계치 판정 |
|---|---|---|
| REST ramp 150VU | **404 req/s, p95 14ms, 에러 0%** | ✅ p95<300ms, err<1% |
| SSE 50→500 동시 | **드롭 0**, ~100 스트림/s 포화, 300동시까지 TTFT p95≤1.2s | ✅ drop=0 |
| PDF spike 50 | **50/50 성공, 실패 0**, 평균 대기 18s(동시성 1 큐 흡수) | ✅ 실패 0 |
| soak 40VU 12분 | **70,931 req, p95 9.9ms, 에러 0%**, api 메모리 +3.9MB 후 평탄·worker 고정 | ✅ p95<400ms, 누수 없음 |

## 4. 미해결 OPEN QUESTION (사람이 결정할 것 — 상세: docs/OPEN_QUESTIONS.md)
1. **커리어넷 apiKey** 발급 → 실데이터로 normalize 필드 매핑 검증 (#4)
2. **Anthropic 키** → AI_PROVIDER=anthropic 전환, 시그널/리포트 품질·비용 측정 (#5)
3. 입시 상세(경쟁률·컷)는 어디가/대학알리미 계약 필요 — 현재 unavailable 응답이 계약상 정상 (#8)
4. 빌드 범위: 결제·성적·메시지·캘린더·어드민은 차기 (#1) — 결제는 "fake success 금지" 원칙상 PG 계약이 선행
5. S3/Sentry/OAuth 키 투입 절차는 MEMORY.md TODO

## 5. mock/stub 전수 목록 (README 하드스톱 — 무라벨 스텁 금지 이행)
| 대상 | 위치 | 동작 |
|---|---|---|
| 커리어넷 API | tools/mock-careernet.ts (CAREERNET_BASE_URL로 전환) | v4.1 규격 fixture, EUC-KR 바이트, dirty data·장애 주입 재현 |
| Anthropic | src/ai/ai-client.ts `AI_PROVIDER=mock` | 고정 토큰 스트림(3ms 페이싱), 시그널은 규칙 기반, 리포트는 결정적 합성 |
| S3 | src/common/storage.ts (키 부재 시) | 로컬 디스크 + HMAC 서명 URL (put/getSignedUrl만 교체하면 S3) |
| Sentry | src/common/sentry.ts | no-op(로그만). DSN 투입 시 @sentry/node 추가 필요 |
| 501 예약 라우트 | auth.controller.ts | OAuth 콜백/비밀번호 재설정/find-id → NOT_IMPLEMENTED 표준에러 |
| 해시 임베딩 | src/ai/embedding.ts | 결정적 로컬 임베딩(품질 베이스라인) — 교체 의도 MEMORY.md |
| admin system/health | common/health.controller.ts | §11 응답의 부분 구현(미수집 항목은 빈 배열/preparing) |

## 5b. 실데이터 연동 현황 (2026-06-12~13, 사용자 키/CSV 제공)
| 소스 | 적재 | 비고 |
|---|---|---|
| 커리어넷 (실 apiKey) | 직업 552·학과 501·학교 472·상담 188(본문 100%)·주니어 300 | 매핑 8건 실API 맞춤 수정, 임베딩 전건 |
| 대학알리미 기본정보 (data.go.kr) | 대학 324개 공시 보강 | School.raw.alimi + 설립유형, 상세에 publicInfo 노출 |
| 대학알리미 **입시통계**(StudentService) | **184개 대학** 경쟁률·충원율·등록률 | 서울대 7.3:1·99.8%·99.1%, 부산대 8.6:1. confidence:'confirmed' |
| 대학별 학과 (공시 CSV 2021) | **48,308 학과** / 1,861 대학 | svyYr 버전·학과상태(신설/폐지), FK매칭 26,337 |
| **Claude 실키** (AI_PROVIDER=anthropic) | Haiku 상담·시그널 + Sonnet 리포트 검증 완료 | prompt caching 동작. 토큰상한 버그 1건 수정 |

**동적 데이터(학과 신설/폐과) 처리 방침** — AI가 아니라 **ingestion이 조사년도(svyYr)별로 재적재**한다.
근거: prompt.md "사실은 도구 결과에서만 인용, 지어내지 마라". AI는 적재된 DB를 RAG로 읽기만.
다음 년도: 같은 importer(tools/import-departments.ts)에 새 공시 CSV 또는 학과정보 API를 svyYr만 바꿔 재투입.
화면은 항상 `svyYr + 출처 + conf`를 동반 노출(GET /v1/admissions/universities/:id/departments).

## 5d. 데이터 API 확장 (2026-06-14)
| 영역 | API | 적재량 |
|---|---|---|
| 봉사처(VMS) | 한국사회복지협의회 vmsdataview/getCenterList | **1,000** |
| 진로교육자료 | 커리어넷 COSE(학년·활동유형 필터) | **455** |
| 해외대학 명칭 | 한국국제교류재단 OverseaUnivKornameService2 | **1,377** |
| 산학협력(현장실습 등) | 대학알리미 IndustryAcademicCooperationService 4개 op | School.raw.industry |
| 경기 신입생충원 | openapi.gg.go.kr/Ncmstus | School.raw.freshman |
| 워크넷 | work24.go.kr 4종(직업/학과/직무/공통코드) | 클라이언트만 |

**학년별 프롬프트(2026-06-14)** — User.grade(E4~H3) 추가. counseling.service가 단계+학년 안내를 자연어로 주입하고
prompt.md의 학년별 톤·내용 지침(초/중/고1/고2/고3) 표를 따른다. prepare 단계에서 학생 학년에 맞는 진로교육자료(COSE)를
RAG 컨텍스트에 추가. 누수 방지를 위해 stripLeakedState에 학년 안내 제거도 포함.

**새 엔드포인트**: /v1/volunteers · /v1/career-materials · /v1/foreign-universities (모두 JWT, confidence 명시).
프론트 "탐색" 탭 신설 — 봉사·진로자료·해외대학 3구역. Playwright E2E 15개(adversarial 9 + journey 4 + explore 2) green.

## 5c. 프론트엔드 (2026-06-14, Vite 실연동)
- 기존은 빌드 시스템 없는 디자인 프로토타입(React+Babel CDN, mock). 이를 **실 백엔드 연결 Vite SPA**로 핵심 흐름 구현(frontend/).
- 화면: 가입/로그인(JWT refresh) → **단계 AI상담**(탐색→파악→추천→준비, SSE 스트림) → **입시**(경쟁률·충원율·등록률 + 학과 track) → 리포트
- 실 브라우저 확인: 서울대 경쟁률 7.3:1·충원율 99.8% + 학과 134개 노출, 단계 바 동작
- 배포: nginx Docker 컨테이너(frontend, :8080)가 SPA 서빙 + /v1→api 프록시. `docker compose up -d`로 EC2 단일 진입.
- **테스트: Playwright E2E 13개 green** (핵심 여정 4 + 적대적/이상행동 9). 백엔드 108/108 green.
- 주의: 학과 API(gg.go.kr)는 한국 IP 전용 — EC2는 ap-northeast-2(서울) 리전 권장.

## 6. 알아둘 운영 메모
- `docker compose up -d` → api(:3000)+worker+pg(:5434)+redis(:6380)+mock-careernet(:4010), 부팅 시 ingestion 자동 1회.
- README.md는 거버넌스 문서라 수정하지 않음 — 실행법은 CLAUDE.md, 장애 대응은 docs/RUNBOOK.md.
- 로컬 5433 포트의 기존 `jinro-postgres-dev` 컨테이너(이전 작업 산출물)는 건드리지 않았음.
