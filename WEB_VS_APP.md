# WEB_VS_APP.md — 웹 전용 작업 가드레일 (프론트엔드)

> **이 repo의 프론트엔드(`frontend/public/legacy/`)는 웹 화면과 앱(모바일) 화면 코드가 한 디렉터리에 섞여 있다.**
> 라이브(www.jinro.it.kr)는 `window.__ROLE_SET = 'web'`으로 기동되어 **웹 화면만** 렌더한다.
> 반응형/UI 수정은 **아래 "✅ 웹" 파일만** 건드린다. **"🚫 앱" 파일은 수정 금지.**

---

## 왜 헷갈리나 (구조)

- `frontend/public/legacy/index.html`이 모든 `.js`를 로드하지만, 화면 표시 여부는 `app-runtime.jsx`의 역할 테이블(`ALL_LIVE_ROLES`)이 각 항목의 `set: 'web' | 'app'` 태그로 거른다.
- 라이브 HTML에 `window.__ROLE_SET = 'web'`이 박혀 있어 → `LIVE_ROLES = ALL_LIVE_ROLES.filter(r => r.set === 'web')` → **`set:'web'`인 컴포넌트만 화면에 뜬다.**
- **파일명이 함정이다:** `student-app.jsx`는 학생 **"앱"**이고, 학생 **"웹"**은 `cross-platform.jsx` 안에 있다.

---

## ✅ 웹 — 수정 대상 (이것만 건드림)

| 화면 | 컴포넌트 | 파일 | 위치 |
|---|---|---|---|
| 웹 로그인 | `WebAuthScreen` | `public-screens.jsx` | 1003~ |
| 학생 웹 | `StudentWebApp` | `cross-platform.jsx` | **393~501줄만** |
| 교사 웹 | `TeacherApp` | `teacher-app.jsx` | 1319~ (파일 전체가 교사 웹) |
| 관리자 웹 | `AdminApp` | `admin-app.jsx` | 894~ (파일 전체가 관리자 웹) |

## 🚫 앱 / 모바일 — 수정 금지 (클로드코드가 실수로 만든 "짬뽕")

| 화면 | 컴포넌트 | 파일 |
|---|---|---|
| 앱 로그인 | `MobileAuthApp` | `mobile-auth.jsx` |
| 학생 앱 | `StudentApp` | `student-app.jsx` |
| 교사 앱 | `TeacherMobileFullApp` | `teacher-mobile.jsx` |
| 교사/관리자 앱 대시보드 | `TeacherMobileDashboard` 등 | `cross-platform.jsx` **503줄 이후** |

> 줄 번호는 코드가 바뀌면 밀린다. **컴포넌트 이름으로 찾는 게 안전.** (`function TeacherApp` 식으로 검색)

---

## ⚠️ `cross-platform.jsx` — 한 파일에 웹+앱 공존 (제일 위험)

- **393 ~ 501줄** → `StudentWebApp` (웹) ··· **수정 OK**
- **503줄 이후** → `TeacherMobileDashboard` 등 모바일 대시보드 ··· **수정 금지**

이 파일을 열 때는 위쪽 절반(학생 웹)만 작업하고 503줄 이후로는 내려가지 않는다.

---

## "반응형 깨짐"의 정의

웹 컴포넌트는 내부에서 `useViewportMobile(768)`을 써서 화면이 좁아지면(≤768px) 레이아웃을 바꾼다.
→ **"반응형 깨짐" = 위 ✅ 웹 화면들이 ~768px 이하 폭에서 깨지는 것.**
새 모바일 컴포넌트를 만드는 작업이 **아니다.** 위 웹 파일들이 좁은 폭에서 안 깨지게 고치는 것이다.

---

## 로컬 미리보기 (로컬 프론트 → 배포 백엔드)

DB·Redis·`.env` 로컬 세팅 없이, 로컬 프론트만 띄워 실서버에 붙여 확인한다.
(인증은 localStorage Bearer 토큰 → 쿠키 도메인 문제 없음. Vite 프록시 → CORS 우회.)

```powershell
cd frontend
pnpm install                                       # 프론트는 워크스페이스 분리 → 별도 설치 필요
$env:VITE_API_TARGET="https://www.jinro.it.kr"     # Vite 프록시를 실서버 백엔드로
pnpm dev                                            # localhost:5173 → /legacy/ → 실계정 로그인
```

- 좁은 폭 확인: 브라우저 개발자도구(F12) → 반응형 모드 → 폭을 360~768px로 줄여가며 깨지는 화면 점검.
- ⚠️ 이 방식은 **실서버 백엔드를 호출**한다. 화면 보기(읽기)는 안전하나, 생성/삭제 동작은 실데이터에 반영되니 테스트성 쓰기는 하지 말 것.

---

## 작업 체크리스트

- [ ] 건드린 파일이 위 "✅ 웹" 목록에 있는가?
- [ ] `student-app.jsx` / `teacher-mobile.jsx` / `mobile-auth.jsx`를 열지 않았는가?
- [ ] `cross-platform.jsx`를 만졌다면 **501줄 이하**에서만 작업했는가?
- [ ] 새 모바일 컴포넌트를 만들지 않고, 기존 웹 컴포넌트의 좁은-폭 레이아웃만 고쳤는가?
