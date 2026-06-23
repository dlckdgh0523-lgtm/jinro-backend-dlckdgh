# RESPONSIVE_PLAN.md — 웹 전용 반응형 수정 작업 계획

> 목표: 라이브(www.jinro.it.kr) **웹 화면**을 폰에서 봐도 안 깨지게.
> 기준: **iPhone 15 = 393px** 최소 보장, iPhone 15 Pro Max = 430px 정상.
> 가드레일 원본은 [WEB_VS_APP.md](WEB_VS_APP.md). 충돌 시 WEB_VS_APP.md 우선.
> 결정: **데이터 표 = 모바일 카드 스택 변환**, **범위 = 웹 4개 전체**.

---

## 0. 근본 원인 (파악 결과)

세 가지가 모든 화면에서 반복됨:

1. **인라인 스타일 + 데스크톱 고정 grid** — `gridTemplateColumns: 'repeat(4~6,1fr)'`, `'2fr 1fr'`가 안 접힘 → 393px에서 한 칸 55~115px로 찌그러짐.
2. **고정 px 폭이 393px 초과** — 표(`minWidth:720/820/880`), 다이얼로그/카드(`width:480/460/440/420`), 알림 팝오버(`width:360 + right:28`)가 화면 밖으로 넘침.
3. **데스크톱 패딩(28/24px)** 이 좁은 폭에서 가용 공간을 갉아먹음.

**셸(사이드바→드로어)은 이미 반응형** (`useViewportMobile(768)`로 학생/교사/관리자 셸 모두 처리됨).
→ 문제는 **screen 내부 콘텐츠가 반응형이 아님**. 그래서 셸 밖으로 넘침.

---

## 1. 함정 / 필수 사항

- **빌드 필수**: `.jsx` 수정 → `frontend`에서 `pnpm build:legacy`(= `node build-legacy.mjs`) 실행해야 `.js` 재생성 + `index.html` 갱신됨. 라이브가 로드하는 건 `.js`. (esbuild가 jsx→js 트랜스폼)
- 인라인 스타일은 CSS 미디어쿼리로 못 덮음 → **`useViewportMobile()`의 `isMobile`을 screen 내부까지 내려서 스타일 값 분기**가 정답(기존 패턴과 동일).
- `cross-platform.jsx`는 **503줄 이후가 모바일 앱(🚫 수정 금지)**. 학생 웹은 **393~501줄만**.
- 학생 웹 셸이 렌더하는 **내부 콘텐츠 화면**(AI상담/입시/리포트 등)은 `admissions.jsx`, `extras-v4.jsx`, `shared-profile.jsx`, `phase2-screens.jsx`, `phase3-screens.jsx` 등 **다른 파일 + 앱과 공유 가능** → 건드리기 전 web 전용인지 1건씩 확인. 공유분은 **isMobile 분기만 추가**(앱 레이아웃 불변).

### 로컬 프리뷰 (DB/Redis/.env 불필요)
```powershell
cd frontend
pnpm install                                       # 워크스페이스 분리 → 별도 설치
$env:VITE_API_TARGET="https://www.jinro.it.kr"     # Vite 프록시 → 실서버 백엔드
pnpm dev                                            # localhost:5173 → /legacy/
```
F12 반응형 모드 393px/430px로 점검. ⚠️ 실서버 호출 → 보기만, **테스트성 쓰기(생성/삭제) 금지**.

---

## 2. 적용 패턴 (4종 정형)

| 패턴 | 대상 | 처리 |
|---|---|---|
| **A. 다단 그리드** | 모든 `repeat(3~6,1fr)`, `'2fr 1fr'`, `'1.4fr 1fr'` 등 | `gridTemplateColumns: isMobile ? '1fr'(또는 '1fr 1fr') : 기존값` |
| **B. 고정폭 카드/다이얼로그** | `width:480/460/440/420` | `width:'min(W, 100% - 32px)'` 또는 `width:'100%', maxWidth:W` |
| **C. 데스크톱 패딩** | `padding:28/24` | `padding: isMobile ? 16 : 기존값` |
| **D. 데이터 표 → 카드 스택** | 표 4개(아래) | 데스크톱 grid 표는 그대로, `isMobile`일 때 **행당 1 카드(라벨:값 세로 나열)** 추가 렌더. 데스크톱 회귀 0. |

알림 팝오버: `maxWidth: 'calc(100vw - 24px)'` 추가.

---

## 3. 파일별 culprit (스캔 결과, 줄번호는 수정되며 밀림 → 컴포넌트명으로 찾기)

### ✅ public-screens.jsx (랜딩 + 웹로그인) — 반응형 분기 0개
- 웹로그인 2단 그리드 `1fr 1.1fr` gap 60 (~745)
- 결제결과 카드 `width:480` (~968)
- 히어로 `fontSize:64` (~90), 절대배치 폰목업/대시보드/블롭 (~118·124·162·189)
- 랜딩 4단 카드 `repeat(4,1fr)` (~222)
- 가격 2단 그리드 (~387·1234)
- 학생/교사 가치 2단 gap 60 (~242·312), 랜딩 nav 패딩/버튼 (~35·45)

### ✅ cross-platform.jsx — StudentWebApp (393~501만)
- 대시보드 패딩 28 (~200), 헤더 `'16px 28px'` (~188)
- KPI `repeat(4,1fr)` (~218), 본문 2단 `'2fr 1fr'` (~225)
- 히어로 텍스트+버튼 가로배치 (~203)
- 콘텐츠 래퍼 패딩 `'24px 16px'` (~437)
- 셸/사이드바/드로어/MobileTopBar는 OK (app-runtime.jsx ~459~620, 무수정)

### ✅ teacher-app.jsx (전체가 교사 웹) — 셸만 isMobile, screen 내부 미적용
- **[표D] 학생표 `minWidth:720`** (~568), **[표D] 성적표 4단** (~862·866)
- KPI `repeat(4,1fr)` (~242), 명렬 `repeat(3,1fr)` (~483·487)
- 2단 레이아웃 (~250·425·784), 학생상세 KPI `repeat(3,1fr)` (~787)
- 알림 팝오버 `width:360` (~1390), 메모 `width:480` (~1094), 메시지 `min(440,100%)` (~1203)
- 검색 input `minWidth:240` (~550), 패딩 28 (~200·424…), 초대코드 `fontSize:56 letterSpacing:8px` (~431)

### ✅ admin-app.jsx (전체가 관리자 웹) — 셸은 OK
- **[표D] 유저표 `minWidth:880`** (~408), **[표D] 감사로그표 `minWidth:820`** (~652)
- 대시보드 `repeat(6,1fr)` (~248·252), `repeat(4,1fr)` (~263), 2단 `'2fr 1fr'` (~271)
- 시스템 5/3단 그리드 (~753·764·772·780)
- 고정카드 `width:480` (~621·715·876), 드로어 `width:480` (~549), 추가유저 `width:420` (~488)
- 패딩 24 (~245·398·407·651·751…)

---

## 4. 실행 순서 (체크리스트)

- [ ] **0. 준비/채증** — `pnpm install` → 프리뷰 → 393/430px 현재 깨짐 스냅샷. 학생 콘텐츠 화면 web/app 공유 여부 1건씩 확인.
- [ ] **1. 공통 안전망** — 고정폭 다이얼로그/카드 일괄 `min()`(패턴B), 알림 팝오버 `maxWidth: calc(100vw - 24px)`.
- [ ] **2-①. public-screens.jsx** (랜딩+웹로그인) — 2단 grid stack, 히어로 폰트/절대배치 모바일 축소·숨김, 4단/2단 카드 분기.
- [ ] **2-②. teacher-app.jsx** — 각 screen에 `isMobile` 전달 → A/C 적용 + **학생표·성적표 카드 스택(D)**.
- [ ] **2-③. admin-app.jsx** — 대시보드/시스템 그리드 분기(A) + **유저표·감사로그표 카드 스택(D)** + 패딩(C).
- [ ] **2-④. cross-platform.jsx StudentWebApp (393~501만)** — 대시보드 그리드/패딩/히어로 분기.
- [ ] **3. 빌드 & 검증** — `pnpm build:legacy` → 프리뷰 393/430px 가로 오버플로 0 + 데스크톱(1024/1440) 회귀 없음 + `git status`로 앱 파일 무변동 확인.
- [ ] **4. 보고** — 변경 요약. commit/push는 사용자 승인 시에만.

---

## 5. 가드레일 (하드스톱)

- **수정 대상**: `public-screens.jsx`, `cross-platform.jsx`(**393~501만**), `teacher-app.jsx`, `admin-app.jsx` (+ 학생 콘텐츠 공유 화면은 isMobile 분기 추가만).
- **절대 금지 파일**: `student-app.jsx`, `teacher-mobile.jsx`, `mobile-auth.jsx`, `cross-platform.jsx` 503줄 이후.
- **절대 금지 행위**: `.env` 수정, commit/push(승인 시에만), README.md 수정.
- 모든 수정은 `.jsx`에 → 끝나면 **`build:legacy` 필수**.
- 새 모바일 컴포넌트를 만드는 게 아니라, **기존 웹 컴포넌트의 좁은-폭 레이아웃만** 고침.

---

## 6. 진행 로그 (작업하며 갱신)

- 2026-06-23: 코드/문서 파악 완료, 계획 수립.
- 2026-06-23: 이창호 버그리스트 트리아지 — 8개 중 4개(#1 로그인·#2 상담흔들림·#7 메뉴스크롤·#8 대시보드)는 웹 반응형, 4개(#3 리포트 자동생성·#4 단서 AI판단·#5 단계 AI판단·#6 학과 데이터)는 백엔드. 결정: 반응형 먼저, 백엔드는 그 다음 별도 트랙.
- 2026-06-23: **적용+빌드 완료**
  - [x] 전역 가로 오버플로 안전망: `.toss-scroll { overflow-x:hidden !important; max-width:100% }` (toss-theme.css) + 마운트 frame `minWidth:0, maxWidth:100%` (app-runtime.jsx) — "모든 페이지 좌우 흔들림"의 공통 루트(중첩 overflow:auto + min-width:0 누락) 차단
  - [x] #7 메뉴 드로어 세로 스크롤: SidebarDrawer 래퍼 `maxHeight:100%, overflowY:auto` (app-runtime.jsx)
  - [x] #1 로그인(AuthScreen): 좌우 2단→모바일 1단, padding/h1 폰트 isMobile 분기, PaymentResult 카드 `width:480`→`maxWidth:480` (public-screens.jsx)
- 2026-06-23: **발견** — 학생 웹 콘텐츠 화면(AICounseling/CareerReport/GradesTrend/StudentBilling)이 `student-app.jsx`(가드레일상 🚫 앱 파일)에 정의되어 웹이 공유. 단 이들은 모바일 최적화 컴포넌트라 자체 고정폭 거의 없음 → 전역 안전망으로 #2 해결 추정, 앱 파일 거의 무수정 가능(가드레일 충돌 회피). #5 프론트 증거: AICounseling 스테퍼에 "단서 N개 더 모으면" 하드코딩(student-app.jsx:457).
- 2026-06-23: 자동 프리뷰(Claude Preview MCP)는 이 레거시 구조(CDN React+다중 .js+인증 리다이렉트)에서 헤드리스 캡처 불안정 → 보류. 검증은 이창호 폰 직접 확인 위주.
- **다음**: #8 메인 대시보드(StudentWebDashboard) → 교사/관리자 표 카드화 → 랜딩.
- 2026-06-23: **웹 4개 반응형 카드화 대량 적용** (브랜치 `feat/web-responsive`, main 보존, push 안 함)
  - 커밋 순서: `b924f76`(전역 안전망+로그인+메뉴) → `7465308`(학생 대시보드) → `d0dfee6`(교사 표/레이아웃) → `c7337fc`(관리자 표/그리드) → 교사 그리드 잔여
  - 학생: 대시보드 KPI 2열·본문 2단→1열·히어로 세로 스택
  - 교사: 학생표/성적표 **카드 스택**, 대시보드/학급/학생상세 다단→1열, 명렬/상세KPI 3열→2열
  - 관리자: 유저표/감사로그표 **카드 스택**, 대시보드 6/4열→2열, 시스템 5/3열→2열, 고정카드 width480→maxWidth
  - 랜딩(Landing3D): 이미 `clamp()`/`vw` 반응형 + 전역 안전망 → 추가 수정 불필요(배포 확인)
  - 빌드: `node build-legacy.mjs` 매 단계 통과(문법 검증). 자동 프리뷰 대신 **배포 검증**.
- **남은 잔여(minor — 전역 안전망으로 좌우 흔들림은 이미 차단됨, 세부 카드화는 배포 확인 후 보완)**:
  교사 알림팝오버/메모·메시지 다이얼로그 폭, 관리자 최근오류표(4열)/유저상세 드로어 폭(480),
  학생 콘텐츠 서브화면(입시/봉사/장학금/메시지/캘린더 등 — 모바일 컴포넌트 공유라 대체로 안전)
- **되돌리기**: main 브랜치 그대로 보존 → `git checkout main`으로 즉시 원복. 배포는 `feat/web-responsive`를 main에 머지 후 push.

## 7. 백엔드 #6 — 대학 학과 데이터

- 2026-06-23: RDS에 대학 472교는 정상, **학과는 7,341건/76교만 연결**(경기데이터드림 2023, 전국 미커버) 진단 종결.
- 일회성 적재로 **34,042건/320→344교(FK)** 즉시 확대. 건양대 등 비어 있던 대학 다수 채워짐.
- **정식 코드화 커밋 `865ad57`** (로컬 main, push 보류):
  - `AlimiClient.listMajorsBySchool(schlId, svyYr)` — 대학알리미 학과 API(B340014/BasicInformationService_1/getUniversityMajorCode)
  - `ingest.worker`에 `departments_alimi` 단계 추가 — schlId 보유 대학 전체 순회, schoolSeq FK 직결 upsert. 매일 04:00 자동 갱신.
  - 기존 `DeptApiClient`(경기데이터드림) 단계는 fallback으로 유지.
  - `ingest.worker` alimi 단계 매칭 강화: School.name과 alimi.name 표기 차이를 정규화(국립 prefix·공백 제거)로 흡수 → schlId 누락 152교 자동 보강.
  - 일회성 스크립트 `src/scripts/backfill-alimi-schlid.ts` — cron 기다리지 않고 즉시 보강 가능.
- **저녁 배포 순서**(인증 풀린 뒤):
  1. 로컬 `git push origin main` (커밋: b924f76 → 7465308 → d0dfee6 → c7337fc → c501981 → 63a9c2b → 865ad57)
  2. EC2에서 `git pull && docker compose -f docker-compose.prod.yml build api worker && docker compose -f docker-compose.prod.yml up -d`
  3. `docker exec jinro-backend-dlckdgh-api-1 node dist/scripts/backfill-alimi-schlid.js` (즉시 보강)
  4. (선택) 다음 04:00 cron부터는 자동 갱신.

## 8. 백엔드 #3·#4·#5 — AI 상담 메타블록 통합

- 2026-06-23: **커밋 `3a6c650`** (로컬 main, push 보류)
- 설계: 추가 LLM 호출 없이 메인 응답 끝에 `<meta>{...}</meta>` 블록 함께 출력 → 한 응답에서 단서·종료여부 모두 받음 (토큰비용 거의 ↑0)
- **#4 단서 AI 판단**: `parseAiMeta`로 메타에서 신선한 단서 추출 → 기존 시그널과 dedup 후 저장. 규칙 기반 폴백(`extractSignalsByRule`) 그대로 유지.
- **#5 단계 AI 판단**: stage 컬럼 신설 없이(마이그레이션 회피) AI가 메타에 단서를 적극적으로 뽑게 해서 evidence 기반 stage가 자연스럽게 빨리 진행됨.
- **#3 리포트 자동 생성**: `meta.shouldFinalize=true && evidenceCount>=5` → `generateReport` 자동 enqueue (멱등키로 중복 방지). 학생이 "마무리/정리해줘" 같은 요청을 하거나 AI가 자연스러운 종결 시점이라고 판단하면 알아서 리포트가 큐에 들어감.
- `stripLeakedState`에 `<meta>` 제거(닫힘/잘림 모두) — 학생에게 메타블록 노출 방지.

## 9. 전체 커밋 현황 (push 보류 — 저녁 일괄)

```
3a6c650 feat(ai): AI 메타블록 — 단서/종료 AI 판단 + 자동 리포트 (#3·#4·#5)
aea2229 docs: 백엔드 #6 진행 로그
865ad57 feat(admissions): 대학알리미 학과 API(B340014) — 전국 320+교 자동 갱신
63a9c2b fix(web-responsive): 알림팝오버·드로어 폭
c501981 fix(web-responsive): 교사 3열 그리드 + 진행기록
c7337fc fix(web-responsive): 관리자 표 카드화
d0dfee6 fix(web-responsive): 교사 표 카드화
7465308 fix(web-responsive): 학생 대시보드
b924f76 fix(web-responsive): 전역 좌우흔들림 + 로그인/메뉴
```

저녁 한 번에:
1. `git push origin main`
2. EC2: `git pull && docker compose -f docker-compose.prod.yml build api worker && docker compose -f docker-compose.prod.yml up -d`
3. (선택, 즉시 학과 보강) `docker exec jinro-backend-dlckdgh-api-1 node dist/scripts/backfill-alimi-schlid.js`

### 이창호 로컬 확인법 (pnpm이 PATH에 없어 corepack 사용)
```powershell
cd C:\Users\mszza\Desktop\jinro\jinro-backend-dlckdgh\frontend
$env:VITE_API_TARGET="https://www.jinro.it.kr"
corepack pnpm dev      # localhost:5173/legacy/ → 폰 크기(393/430px)로 확인
```
