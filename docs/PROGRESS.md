# PROGRESS.md

## P0 정찰 — DONE (2026-06-12 14:10 KST)
- ../jinro-front 전체 분석 (직접 + Explore 에이전트 3개 병렬)
- 산출: docs/FRONTEND_CONTRACT.md, docs/OPEN_QUESTIONS.md(#1~#10), docs/DECISIONS.md(#1~#30)
- 핵심: 프론트는 정적 프로토타입 → 계약 1차 근거는 backend-integration.md + app-runtime.jsx fetch 스켈레톤.
  에러 형태 충돌(최상위 code/message) 발견 → 병합 형태로 해소.

## P1 스캐폴드 — DONE (2026-06-12 14:50 KST)
- NestJS 11 + TS strict, 모듈 career/ai/report/jobs/realtime/common/db + worker.ts 분리 엔트리
- Dockerfile(멀티스테이지 base/api/worker) + docker-compose(pgvector pg16, redis7, mock-careernet)
- 전역 에러필터(병합 에러 형태), /health /ready, pnpm build 통과

## P2 커리어넷 어댑터 — DONE (2026-06-12 15:20 KST)
- client: HTTPS 승격, 타임아웃 5s + p-retry 2회 + opossum 서킷, apiKey env 전용
- EUC-KR 바이트 디코딩(iconv-lite, charset 선언 우선), fast-xml-parser, sanitize(null문자열/<br>/&lt;br&gt;/\r\n/중복공백), 배열 정규화
- Redis 캐시 + single-flight, 도메인 TTL. ingestion 워커: 5소스 → PostgreSQL upsert (mock 기준 jobs 120/majors 45/schools 60/counsel 40/junior 30 적재 확인)
- 스모크: EUC-KR 한글 정상, dirty data 정제 확인, 적재 후 meta.source=db 전환 확인

## P3 AI 상담 — DONE (2026-06-12 15:40 KST)
- 해시 임베딩(256d) + pgvector cosine + tsvector + LIKE 폴백, RRF 병합 retriever
- AiClient: mock(기본)/anthropic(Haiku/Sonnet + prompt caching). 429/529/컨텍스트초과/필터/중단 매핑
- SSE: POST messages 토큰 스트림(token/done/error, heartbeat, disconnect abort) + GET /stream 재수신(Last-Event-ID) + ?stream=false 즉답
- 시그널 추출(mock: 규칙 기반) → evidence 기반 completeness. 스모크: 토큰 스트림·시그널·진행도 확인

## P4 PDF 리포트 — DONE (2026-06-12 16:00 KST)
- POST /v1/reports(+세션 트리거) → BullMQ enqueue {jobId}, 멱등키(세션+대화 해시) + enqueue 실패 복구
- 워커: 브라우저 재사용 + 잡당 컨텍스트, Pretendard base64 임베드, SVG 차트, __chartReady 대기, 20잡 재시작, DLQ+Sentry
- 스모크: PDF 40KB 생성, 한글/차트/disclaimer 렌더 확인, presigned-유사 URL 다운로드 확인

## P5 하드닝 — DONE (2026-06-12 16:10 KST)
- 에러코드 enum(CAREERNET_/AI_/PDF_/AUTH_/VALIDATION_), traceId(ALS)+pino, Sentry noop
- rate limit(전역 100/min, 로그인 5/min, AI 30/min), 입력 100kb 제한, AI 동시 스트림 상한, SSE backpressure 1MB 가드
- docs/RUNBOOK.md 작성 (커리어넷 다운/Anthropic 429/PDF OOM/Redis 끊김/DLQ 재처리)

## P6 테스트 스위트 — DONE (2026-06-12 17:05 KST)
- **83/83 green** (13파일) + coverage/ (statements 83.9%, functions 89.0%)
- 단위 33: sanitize/decode(euc-kr)/normalize/AI가드(abort·컨텍스트상한)/시그널/임베딩/storage서명/캐시강등
- 통합 50: 인증(회전·rate limit), 커리어넷(캐시히트·single-flight 20동시→upstream 1회·장애주입 4종),
  AI상담(SSE token/done·Last-Event-ID 재개·소유권·리포트 멱등·429), 알림(dedupe·SSE 재연결 누락분·팬아웃 30),
  E2E(가입→검사→스트림 5회→PDF 생성→다운로드→서명위조 거부), 동시 PDF 10건 멱등, 퍼징(인젝션·NUL·413), 계약(zod 모양 고정)
- 퍼징이 찾은 실버그 3건 수정: ① majors seq int32 오버플로 500 ② body-parser 413/JSON파싱 에러가 INTERNAL로 매핑
  ③ NUL 바이트(0x00) → PG 22021 500 (전역 입력 정제 미들웨어 추가, Express5 req.query lazy getter 대응)

## P7 부하 테스트 — DONE (2026-06-12 18:30 KST)
- docker compose 전체 스택(api+worker+pg+redis+mock) + docker-compose.load.yml 오버레이로 실행
- REST ramp 150VU: 404 req/s, p95 14.0ms, 에러 0% ✅ | SSE 50→500: 드롭 0, ~100스트림/s 포화, 300동시까지 TTFT p95 1.2s ✅
- PDF spike 50: 50/50 성공, 실패 0, 평균 대기 18s(동시성1 큐 흡수) ✅ | soak 12분: 70,931 req, p95 9.9ms, 에러 0, 메모리 평탄 ✅
- 발견: rate limit 미해제 시 96.9% 429(가드 동작 증명), express 미선언 의존·prisma binaryTargets 등 배포 버그 3건 수정
- 산출: docs/LOAD_TEST_REPORT.md, load/k6/*, tools/sse-load.ts, load/k8s/(옵션 매니페스트)

## P8 문서/최종 리포트 — DONE (2026-06-12 18:40 KST)
- PRD.md, CLAUDE.md(아키텍처·함정·금지목록), MEMORY.md(TODO·다음 이터레이션), docs/REPORT.md(5분 요약)
- README.md(거버넌스)는 무수정 보존 (DECISIONS #37)

## [Phase B] 프론트 실연동(Vite) + 학과 API + 단계 프롬프트 — DONE (2026-06-14)
- 학과정보 API(경기데이터드림 openapi.gg.go.kr/Univmjrm): DeptApiClient, ingestion이 최신연도(2023, 7,341학과) 자동 갱신 → "연도별 자동 갱신" 실증. 한국 IP 전용(서울 리전 주의)
- AI 상담 단계적 재설계: prompt.md 4단계(탐색→파악→추천→준비), stageOf() 계산 + 자연어 주입, <state> 누수 방지(프롬프트+stripLeakedState). 진로상담(사람)/AI상담 분리 명시. 실키 검증으로 토큰상한 버그 수정
- **프론트 Vite 핵심 흐름 실연동**: 가입/로그인(JWT refresh) → 단계 AI상담(SSE 스트림+단계바) → 입시(경쟁률+학과 track) → 리포트. nginx Docker(:8080, /v1 프록시), compose 통합, EC2 배포 형태
- **Playwright E2E 13개 green**: 핵심 여정 4 + 적대적 9(인젝션·퍼징·연타·누수·404 등 이상행동 전수). 실 브라우저로 동작·디자인 확인(서울대 경쟁률 7.3:1+학과 134개 화면 노출)
- 백엔드 테스트 108/108 green

## [Phase B] Claude 실키 + 입시통계(StudentService) — DONE (2026-06-13)
- Claude 실키(셸 env, .env 미사용): Haiku 상담·시그널, Sonnet 리포트, prompt caching 모두 검증. 실키 검증으로 토큰상한 버그 발견·수정(heavy 전용 AI_MAX_REPORT_TOKENS + parseReportJson 견고화, 단위테스트 7개)
- 대학알리미 입시통계(StudentService) 연동: 경쟁률·신입생충원율·등록률(indctVal1 공통필드, schlId+svyYr). ingestion이 184개 대학 보강 → School.raw.admissions. 대학 상세 admissions가 'unavailable'→'confirmed'(서울대 7.3:1·99.8%·99.1%)
- 전체 테스트 104/104 green(coverage 84.5%). compose에 AI/입시통계 키 env 주입 추가. 디버그 툴 정리

## [Phase B] 대학알리미 + 대학별 학과 — DONE (2026-06-13, 사용자 키/CSV 제공)
- 공공데이터포털 BasicInformationService_2 연동: 오퍼레이션 명세 확보 → getComparisonPubYear/getComparisonUniversitySearchList 검증 → AlimiClient(UTF-8 XML, resultCode 체크) → ingestion 보강(School.raw.alimi + 설립유형)
- 대학별 학과 48,308행 CSV(2021 공시) 적재: UniversityDepartment 테이블(svyYr 버전·학과상태 신설/폐지), RFC-4180 EUC-KR importer, FK 매칭 26,337
- 엔드포인트: GET /v1/admissions/universities/:id/departments (프론트 계약 정렬: 한글 track·conf·recruit null·svyYr 고지), search에 offeringUniversities(학과→대학 역검색)
- 프론트 facade(app-runtime.jsx)에 universities/universityDepartments/admissionsSearch 추가(web+app)
- 검증: 서울대 134학과(폐지 포함 189), 홍익대 82, 부산대 115, track 필터·역검색 정상. 전체 테스트 97/97 green(coverage 84.6%)
- 동적 데이터 원칙 확립: 학과 신설/폐과는 ingestion이 svyYr별 재적재(매년 공시), AI는 읽기만(RAG) — prompt.md 근거

## [Phase B] 실 커리어넷 API 연동 — DONE (2026-06-12 17:55 KST, 사용자 키 제공)
- 검증 프로브(엔드포인트당 1~3회)로 실 응답 구조 확인 → 매핑 8건 수정 (DECISIONS #38~#44)
- 핵심 차이: rel_job_nm=유사직업(학과 아님, 상세 departList가 학과), MAJOR는 gubun 필수,
  COUNSEL=코드표+COUNSEL_VIEW(gubun+con_cd) 2단 수집, 페이지 크기 10 고정→pageIndex 루프, inspct는 apikey 소문자, &#xd; 숫자 엔티티 정제 추가
- mock 서버를 실 API 형태로 갱신 → 테스트가 실매핑 검증. **전체 테스트 89/89 green**
- 실데이터 적재 완료: 직업 552, 학과 501, 학교 472, 상담 188(본문 100%), 주니어 300, 임베딩 전건
- 키는 셸 env로만 주입 (compose env 보간, 파일 미저장)

# ─── 최종: DEFINITION OF DONE 체크 ───
- [x] pnpm build 성공 (+ tsc --noEmit 전체 통과)
- [x] 전체 테스트 green 83/83 + coverage/ 생성 (statements 83.9%)
- [x] P6 카오스/엣지 전부 통과 (격리 0건)
- [x] docker compose up 으로 API+워커+postgres+redis 기동 (+mock-careernet)
- [x] k6 부하 리포트 docs/LOAD_TEST_REPORT.md — 임계치 4/4 충족
- [x] REPORT.md / PROGRESS.md / OPEN_QUESTIONS.md / DECISIONS.md 갱신 완료
## P7 부하 테스트 — PENDING
## P8 문서/리포트 — PENDING
