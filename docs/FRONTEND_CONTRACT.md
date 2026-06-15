# FRONTEND_CONTRACT.md — jinro-front 역추출 계약 (P0 정찰 결과)

> 작성: 2026-06-12. 근거는 전부 `../jinro-front` 코드의 파일:라인 인용.
> 프론트는 **정적 프로토타입**(React+Babel, 인메모리 목데이터)이다. 실제 HTTP 호출은 아직 없고,
> ① `backend-integration.md`(프론트가 명시한 백엔드 연동 사양서)와 ② `app-runtime.jsx`의
> "REAL fetch client skeleton"이 계약의 1차 근거다.

---

## 1. HTTP 클라이언트 계약 (app-runtime.jsx)

| 항목 | 값 | 근거 |
|---|---|---|
| baseURL | `window.VITE_API_BASE_URL` 없으면 `/v1` | app-runtime.jsx:108, 183 |
| 인증 헤더 | `Authorization: Bearer <accessToken>` | app-runtime.jsx:116 |
| 토큰 저장 | `localStorage jinro:accessToken / jinro:refreshToken` | app-runtime.jsx:195-197 |
| 401 처리 | `POST {base}/auth/refresh` body `{refreshToken}` → `{accessToken, refreshToken?}` 후 원요청 1회 재시도. 실패 시 세션만료 처리 | app-runtime.jsx:126-141 |
| credentials | `include` (쿠키 허용 → CORS `credentials:true` 필요) | app-runtime.jsx:120 |
| 204 | body 없음 → null | app-runtime.jsx:144 |
| **에러 바디** | **`{ code, message, details? }`를 응답 최상위에서 읽음** — `body.code`, `body.message` | app-runtime.jsx:147-149 |

⚠️ **에러 형태 충돌**: 미션 표준은 `{ error: { code, message, traceId } }`, 프론트는 최상위 `code/message`.
→ **결정**: 백엔드는 두 형태를 병합해 반환한다:
`{ code, message, traceId, details?, error: { code, message, traceId } }` (DECISIONS.md #7)

예시 엔드포인트 호출 (app-runtime.jsx:168-177):
`GET /teacher/students`, `GET /student/dashboard`, `GET /notifications`, `GET /admin/payments`,
`POST /admin/users/:id/disable {reason}` — 모두 baseURL(`/v1`) 기준 상대경로.

## 2. 전체 API 사양 (backend-integration.md — 프론트가 작성한 연동 사양서)

`../jinro-front/backend-integration.md`가 §1~§15에 걸쳐 전체 제품의 API를 정의한다(인증·사용자·AI상담·
성적·입시·메시지·캘린더·알림SSE·결제·어드민·헬스·피드백). 응답은 `{ data, error?, meta? }` 래퍼 권장(:5).

### 이번 빌드 구현 범위 (미션의 백엔드 책임 3가지 + 전제 인프라)

미션이 백엔드 책임을 (1) 커리어넷 프록시 (2) AI 상담 SSE (3) PDF 리포트로 한정하므로,
아래만 이번 빌드에서 구현한다. 나머지는 §"차기 범위"로 문서화 (OPEN_QUESTIONS.md #1).

#### 2.1 인증 (전 화면 전제 — backend-integration.md §1)
| Method | Path | Body | 응답 |
|---|---|---|---|
| POST | /v1/auth/signup/student | `{email,password,name,inviteCode?,consents:{tos,privacy,academic,ai,age,mkt?}}` | `{accessToken,refreshToken,user}` |
| POST | /v1/auth/signup/teacher | `{email,password,name,school,classroom,consents}` | 동일 |
| POST | /v1/auth/login | `{email,password,role?}` | `{accessToken,refreshToken,user,nextPath}` |
| POST | /v1/auth/refresh | `{refreshToken}` | `{accessToken,refreshToken}` |
| POST | /v1/auth/logout | - | `{ok:true}` |
| GET | /v1/auth/me | - | `User` |

- JWT 만료 15분 / refresh 14일, bcrypt, 만 14세 미만 차단(consents.age 필수) (§1 보안)
- 로그인 rate limit 5/min/IP (§1)
- consents 항목 정의: mobile-auth.jsx:181 `CONSENT_ITEMS` = terms(tos)/privacy/academic/ai/age 필수, mkt 선택
- Google/Kakao OAuth 콜백, 비밀번호 재설정, find-id는 **차기 범위** (키·메일 인프라 없음 → mock 불가한 외부 의존)

#### 2.2 커리어넷 프록시 (미션 책임 #1)
프론트는 공공 API를 절대 직접 호출하지 않는다 (backend-integration.md:93 "백엔드가 fetch → normalize → cache → serve").
커리어넷 데이터 소스 명시: student-app.jsx:599 (`org:'career.go.kr'`), public-screens.jsx:1170 (FAQ "커리어넷 등 공식 데이터를 백엔드가 캐싱·정규화").

노출 엔드포인트 (정규화된 내부 모양, prompt.md의 AI 도구와 1:1 대응):
```
GET /v1/career/jobs?q=&theme=&cursor=&limit=      직업백과 목록 (JSON 계열)
GET /v1/career/jobs/:seq                          직업 상세
GET /v1/career/junior-jobs?q=&cursor=             주니어직업 (초·중등)
GET /v1/career/junior-jobs/:seq
GET /v1/career/majors?q=&cursor=                  학과 (EUC-KR XML 계열)
GET /v1/career/majors/:majorSeq
GET /v1/career/schools?q=&region=&gubun=&cursor=  학교/대학 (EUC-KR XML)
GET /v1/career/counseling-cases?q=&cursor=        진로상담사례 (EUC-KR XML)
GET /v1/career/education-materials?q=&cursor=     진로교육자료 COSE (EUC-KR XML)
GET /v1/career/tests                              심리검사 목록 (inspct v2)
```
응답 모양: `{ data: T[] | T, meta?: { nextCursor?, total?, source, updatedAt } }`

#### 2.3 입시 조회 (§5 — 커리어넷 SCHOOL/MAJOR 적재 데이터 기반)
```
GET /v1/admissions/universities?region=&type=&q=&cursor=   → { data: University[], meta:{nextCursor} }
GET /v1/admissions/universities/:id                        → { data: University & { departments } }
GET /v1/admissions/search?q=&track=                        → { data: {universities, departments} }
POST /v1/career/target { career, univ, dept, track?, reason? }  → { data: CareerTarget }
GET  /v1/career/targets                                    → { data: CareerTarget[] } (최대 3개, shared-profile.jsx:315)
```
- `University` 모양 (admissions.jsx:9-28): `{ id, name, short, region, type:'national'|'private'|'municipal'|'special', deptCount, confidence }`
- `Confidence = 'confirmed'|'estimated'|'unavailable'` (admissions.jsx:7,33-37; backend-integration.md:108-118)
  - `unavailable` → 프론트는 숫자 미표시, `estimated` → 경고 표시. `dataAgeDays > 30` 시 자동 `estimated` 강등
- 모든 데이터에 `source`(출처 문자열), `updatedAt` 필수 (admissions.jsx:313-316)

#### 2.3b 대학별 학과 (대학알리미 공시 — 2026-06-13 추가)
```
GET /v1/admissions/universities/:id/departments?track=&q=&includeInactive=
  → { data: Dept[], meta: { total, svyYr, source, updatedAt, confidence, note } }
```
- `Dept` 모양 = 프론트 계약(admissions.jsx:42)에 정렬: `{ id, name, college, track:'인문'|'자연'|'예체능'|null, recruit:null, conf:'confirmed', campus, series, degree, years, status, active }`
- track은 **한글**(프론트가 한글로 렌더), 신뢰도 필드명은 **conf**(대학 목록의 `confidence`와 다름 — admissions.jsx:42 vs :28)
- `meta.svyYr`(조사년도)·`note`로 "언제 기준인지 + 매년 신설/폐과 가능" 항상 고지
- 기본은 현존 학과(active)만, `includeInactive=true`면 폐지 학과 포함(status로 구분)
- 모집인원(recruit)은 학과 '목록' 공시에 없어 null — 프론트는 null이면 "모집 N명" 미표시
- `GET /v1/admissions/search?q=학과명` 응답에 `offeringUniversities[]`(그 학과 개설 대학) 추가
- **동적 데이터 처리 원칙**: 학과 신설/폐과는 AI가 아니라 ingestion이 svyYr별로 재적재(매년 새 공시 CSV/API). AI는 읽기만.

#### 2.4 AI 진로상담 (미션 책임 #2 — §3)
```
POST /v1/ai-counseling/sessions                  → { data: Session }
GET  /v1/ai-counseling/sessions/active           → { data: Session | null }
POST /v1/ai-counseling/sessions/:id/messages     { text } → SSE 스트림 (아래)
GET  /v1/ai-counseling/sessions/:id/stream?messageId=  → EventSource 대안 (GET 재수신)
GET  /v1/ai-counseling/sessions/:id/transcript   → { data: { messages: Message[], signals: Signal[] } }
GET  /v1/ai-counseling/sessions/:id/progress     → { data: { evidenceCount, completeness, signals } }
POST /v1/ai-counseling/sessions/:id/report       → { data: { reportId, jobId } } (충분한 evidence 필요)
GET  /v1/ai-counseling/reports/:id               → { data: Report }
```
- **SSE 스트림**: `event: token` (data: `{delta}`), `event: done` (data: `{messageId, signals, usage}`),
  `event: error` (data: `{code, message}`), heartbeat 주석 라인, `X-Accel-Buffering: no`
- 스트리밍 UX 근거: 타이핑 인디케이터 ChatThinking (student-app.jsx:491-514), "실시간 SSE 알림" (student-app.jsx:770)
- `Message` (student-app.jsx:26-32): `{ id, role:'ai'|'user', text, createdAt }`
- `Signal` (student-app.jsx:34-39, backend-integration.md:68): `{ tag:'흥미'|'강점'|'가치'|'맥락', text, sourceMessageId, confidence }`
- `progress.completeness`는 **evidence 기반** (고정 step 금지, backend-integration.md:67). 프론트 공식 참고: `evidenceCount*12+20` cap 100 (student-app.jsx:344-345), 리포트 버튼은 evidenceCount>=5에 활성 (student-app.jsx:448-457)
- `Report` (extras-v4.jsx:12-33): `{ id, student, generated, turns, headline, summary, careers:[{title,score,why}], majors:string[], signals, strengths:string[], risks:string[], nextActions:string[], disclaimer }` — 항상 disclaimer 포함, "잠정 가설" 표기 (backend-integration.md:69)
- AI provider: Anthropic primary (키 없으면 mock 스트림). 토큰/비용 로깅 필수 (backend-integration.md:70)

#### 2.5 PDF 리포트 (미션 책임 #3 — 미션 P4)
```
POST /v1/reports { sessionId?, reportId?, idempotencyKey? } → { data: { jobId, reportId } }
GET  /v1/reports/:id              → { data: { id, status:'queued'|'rendering'|'done'|'failed', pdfUrl?, error? } }
GET  /v1/jobs/:id/events          → SSE: event: progress/done/error (Last-Event-ID 지원)
```
- 프론트 PDF 흔적: jsPDF+html2canvas로 클라이언트 PDF (admin-export.jsx:6-67, 한글 Pretendard 폰트 :30)
  → 서버 PDF는 AI 리포트의 정식 산출물(차트 포함). 클라이언트 export와 별개. (OPEN_QUESTIONS #3)
- 완료 알림: SSE `ai.report.ready` (backend-integration.md:173)

#### 2.6 알림 / SSE (§8 — "한 번 깔리면 모든 화면이 살아남")
```
GET   /v1/notifications?cursor=&unreadOnly=   → { data: Notification[], meta:{nextCursor} }
PATCH /v1/notifications/:id/read              → { data: { ok:true } }
POST  /v1/notifications/read-all              → { data: { ok:true } }
GET   /v1/notifications/sse                   → text/event-stream
```
- Notification 필수 필드: `{ id, type, dedupeKey, title, body, createdAt, targetUrl, payload }` (backend-integration.md:183)
- **dedupeKey 필수** — 프론트가 24h Set으로 중복 토스트 차단 (backend-integration.md:184)
- heartbeat 30s, 클라 재연결 지수 백오프, **Last-Event-ID로 누락분 재전송** → 백엔드는 최근 N분 이벤트 보관 (backend-integration.md:187-188)
- 이번 빌드에서 발생시키는 이벤트 타입: `ai.report.ready`, `student.joined`(가입), 그 외 타입은 enum만 예약

#### 2.7 헬스
`GET /health`, `GET /ready` (미션 P1) + `GET /v1/admin/system/health`(§11)는 **부분 구현**: build/services(db,redis,queue,sse,aiProvider)/resources 요약만.

### 차기 범위 (이번 빌드 제외 — OPEN_QUESTIONS #1)
성적(§4), 메시지/상담예약(§6), 캘린더(§7), 결제/구독(§9 — "PG 미연동 시 fake success 절대 금지" 원칙에 따라 미구현이 정답), 어드민 전체(§10), 피드백(§12), OAuth 콜백/비밀번호 재설정/find-id(§1 일부), 교사 학급 관리(§2).

## 3. CORS / env
- CORS 화이트리스트: `jinronavi.kr`, `admin.jinronavi.kr`, dev origin (backend-integration.md:294). credentials 포함 (app-runtime.jsx:120)
- 프론트 env (backend-integration.md:305-313): `VITE_API_BASE_URL=https://api.jinronavi.kr`, `VITE_SSE_ENDPOINT=/v1/notifications/sse`
- Rate limit: API 100/min/user, AI 상담 30/min, 로그인 5/min/IP (backend-integration.md:296, §1)

## 4. 데이터 모델 후보 (엔티티·관계)
```
User (id, email, passwordHash, name, role: student|teacher|admin, school?, classroom?, consents JSON, status)
RefreshToken (id, userId→User, tokenHash, expiresAt, revokedAt?)
CareerJob (seq PK, name, aptitude, salary, prospect, relatedMajors[], raw JSON, embedding vector, tsv tsvector)  ← 직업백과 적재
JuniorJob (seq, name, field, raw)                                   ← 주니어직업 적재
Major (majorSeq, name, field, departments[], raw, embedding, tsv)   ← 학과 적재
School (seq, name, region, gubun, link, raw)                        ← 학교 적재 (admissions universities 소스)
CounselCase (seq, title, question, answer, raw, embedding, tsv)     ← 상담사례 적재
CounselingSession (id, userId, status: active|ended, startedAt, endedAt?)
CounselingMessage (id, sessionId, role, text, createdAt)
CounselingSignal (id, sessionId, tag, text, sourceMessageId, confidence)
Report (id, sessionId, userId, content JSON, status, pdfKey?, idempotencyKey, createdAt)
Notification (id, userId, type, dedupeKey, title, body, targetUrl, payload JSON, readAt?, createdAt)
CareerTarget (id, userId, career, univ, dept, track, reason?, createdAt)  ← 최대 3개
IngestionRun (id, source, status, count, startedAt, finishedAt, error?)
```

## 5. SSE/스트리밍/폴링 기대 지점 요약
| 지점 | 방식 | 근거 |
|---|---|---|
| AI 토큰 | SSE (token/done/error) | ChatThinking 타이핑 UX student-app.jsx:491-514 |
| 알림 | SSE `/v1/notifications/sse` + Last-Event-ID 재전송 | backend-integration.md:163-188 |
| PDF 진행 | SSE `/v1/jobs/:id/events` 또는 GET 폴링 | 미션 P4, backend-integration.md:206 결제 폴링 패턴 준용 |
| 결제 결과 | 폴링 (차기) | backend-integration.md:206 |

## 6. 커리어넷 흔적
- apiKey 노출/euc-kr 흔적은 프론트에 **없음** (전부 백엔드 책임으로 설계됨) — 직접 호출 금지 명시 backend-integration.md:93
- 데이터 출처 라벨만 존재: career.go.kr (student-app.jsx:599), "대입정보포털·대학알리미·커리어넷" (public-screens.jsx:1170)
