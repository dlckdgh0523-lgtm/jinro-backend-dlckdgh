# jinro-front-app — 진로나침반 프론트엔드 (Vite + React + TS)

기존 디자인 프로토타입(React+Babel CDN, mock)을 **실제 백엔드에 연결되는 Vite SPA**로 구현한 핵심 흐름.

## 화면 (핵심 수직 슬라이스)
- **가입/로그인** — JWT(localStorage) + 401 silent refresh (src/api/client.ts)
- **AI 상담** — 단계 바(탐색→파악→추천→준비) + SSE 토큰 스트리밍 + 단서 누적 (src/pages/Counseling.tsx)
- **대학·학과** — 대학 검색 → 경쟁률·충원율·등록률(대학알리미 공시) + 개설 학과(track 필터) (src/pages/Admissions.tsx)
- **진로 리포트** — Sonnet 합성 리포트(headline/careers/risks/disclaimer) (src/pages/Report.tsx)

## 실행
```bash
pnpm install
pnpm dev            # :5173, /v1 → http://localhost:3000 프록시 (VITE_API_TARGET로 변경)
pnpm build          # dist/ 정적 빌드
pnpm test:e2e       # Playwright E2E (백엔드 :3000 + dev 서버 필요)
```

## 배포 (EC2 + Docker)
루트 `docker compose up -d`가 nginx 컨테이너(frontend)로 빌드된 SPA를 **:8080**에 서빙하고 `/v1`을 api로 프록시.
EC2에선 80↔8080 매핑 또는 nginx 80 노출로 단일 진입점. (참고: 학과 API gg.go.kr은 한국 IP 전용 → 서울 리전 권장)

## 테스트 (Playwright E2E — 13 케이스)
- **journey.spec.ts(4)**: 가입→단계 상담→리포트, 입시 조회(경쟁률+학과), 로그아웃 가드, 재로그인
- **adversarial.spec.ts(9)**: 잘못된 로그인, 가입 퍼징(이메일 네이티브 차단/짧은비번 백엔드 차단), 동의 누락,
  상담 인젝션·특수문자(누수·크래시 없음), 빈 메시지 차단, 연타 중복 차단, 증거부족 리포트, 404 리다이렉트, 검색 인젝션
