# 배포 가이드 — www.jinro.it.kr (AWS Ubuntu + Docker)

구성: **Caddy(자동 HTTPS) → frontend(nginx, 정적+/v1 프록시) → api(NestJS) + worker / postgres(pgvector) + redis**.
인증서는 Caddy가 Let's Encrypt로 **자동 발급·자동 갱신** — certbot 명령/크론 불필요.

## 0. 사전 준비 (1회, 콘솔에서)
1. **DNS A 레코드** — `www.jinro.it.kr` → (AWS 서버 공인 IP). 루트도 쓰려면 `jinro.it.kr` → 같은 IP.
   - 적용 확인: `dig +short www.jinro.it.kr` 가 서버 IP를 반환해야 함(전파 수 분~수십 분).
2. **보안 그룹 인바운드** 개방: `22`(SSH), `80`(HTTP/인증서 발급), `443`(HTTPS).
3. **OAuth 콜백 등록** (아래 "OAuth 콜백 등록" 절) — 안 하면 소셜 로그인만 실패.

## 1. 서버에 코드 올리기
```bash
git clone <레포URL> jinro && cd jinro     # 또는 scp/rsync (node_modules 제외)
```
`deploy/run-prod.sh` 에 실 키가 채워져 있습니다(시크릿 — 공개 저장소에 올리지 말 것).

## 2. 한 방 배포
```bash
bash deploy/run-prod.sh
```
순서: 이미지 빌드 → 스택 기동 → API 헬스 대기 → (옵션)관리자 생성.
첫 실행은 `INGEST_ON_BOOT=true` 라 공공데이터 적재로 수 분 걸립니다. 이후엔 스크립트에서 `false` 로 두세요(매일 04:00 자동 갱신).
DB 마이그레이션은 api 기동 커맨드(`npx prisma migrate deploy`)가 자동 수행합니다.

## 3. 관리자 계정
`deploy/run-prod.sh` 의 `ADMIN_PASSWORD` 에 강한 비번을 넣으면 자동 생성. 수동:
```bash
docker compose -f docker-compose.prod.yml exec api \
  node dist/scripts/create-admin.js admin@jinro.it.kr '강한비밀번호' 운영관리자
```

## 4. 확인
```bash
docker compose -f docker-compose.prod.yml ps              # 전 서비스 Up/healthy
docker compose -f docker-compose.prod.yml logs -f caddy   # 인증서 발급 로그
curl -I https://www.jinro.it.kr                           # 200/302 + TLS
```
브라우저 `https://www.jinro.it.kr` → 로그인/회원가입 + 구글·카카오 로그인 테스트.

## OAuth 콜백 등록 (필수)
**구글** — https://console.cloud.google.com → **API 및 서비스 → 사용자 인증 정보** →
해당 **OAuth 2.0 클라이언트 ID** → **승인된 리디렉션 URI** 에 추가:
```
https://www.jinro.it.kr/v1/auth/google/callback
```

**카카오** — https://developers.kakao.com → 내 애플리케이션 → 해당 앱 →
**앱 설정 → 플랫폼 → Web** 에 사이트 도메인 `https://www.jinro.it.kr` 추가,
**제품 설정 → 카카오 로그인 → Redirect URI** 에 추가:
```
https://www.jinro.it.kr/v1/auth/kakao/callback
```
(카카오 로그인 활성화 ON, 동의항목에 닉네임·카카오계정(이메일) 포함.)

서버 env `OAUTH_REDIRECT_BASE=https://www.jinro.it.kr` 가 이미 설정돼 콘솔 등록값과 일치합니다.

## 운영 팁
- 재배포: `git pull && docker compose -f docker-compose.prod.yml build && docker compose -f docker-compose.prod.yml up -d`
- 인증서 자동 갱신(Caddy). `caddy_data` 볼륨이 인증서를 영속 → 재시작해도 재발급 안 함.
- 로그: `docker compose -f docker-compose.prod.yml logs -f api worker`
- 백업: `pgdata`(DB) + `storage`(PDF/업로드) 볼륨 정기 스냅샷 권장.
