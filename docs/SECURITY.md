# SECURITY.md — 보안 정책 · 백업 · 개인정보 영향평가(PIA)

> 진로나침반은 미성년자(만 14세 이상 고등학생 위주)의 학업·진로 데이터를 다룹니다.
> 학생 정보 보호가 1순위. 이 문서가 운영 표준입니다. 변경 시 reviewer 1명 이상 확인.

## 1. 신고
취약점 발견 시: **dlckdgh0523@gmail.com** (제목 `[SECURITY]`). 48시간 내 1차 회신.
공개 공시 전에 패치 협의. 책임감 있는 공개 우대.

## 2. 적용 중인 보안 (구현됨)

### 인증·세션
- JWT 15분(access) / 14일(refresh, 회전)
- bcrypt (10 rounds)
- 로그인 5회 실패 → **15분 계정 잠금** (Redis, IP 우회 brute-force 차단)
- 비밀번호 변경 시 **모든 refresh 토큰 일괄 폐기** (다른 기기 자동 로그아웃)
- **Refresh token family** — 이미 회전된 토큰 재사용 감지 시 같은 family 전체 폐기
- 만 14세 미만 가입 차단 (consents.age 필수)
- 새 IP 로그인 시 본인 알림 + AuditLog

### 인가
- 학생: 본인 데이터만
- 교사: 같은 학교·학급 학생만 (학급 미배정 교사는 학생 조회 차단)
- 관리자: 전체 (모든 행위 AuditLog)
- 교사·관리자의 학생 상세 조회는 `student.view` AuditLog 자동 기록

### 입력
- 모든 외부 입력 zod 검증
- 이름/학교/학급/초대코드/career/recipientId/event 텍스트에 **정규식**(컨트롤 문자·HTML·SQL 메타 차단)
- body 100KB 한도, NUL 바이트 전역 제거

### LLM 보안 (4중 방어)
- **입력 사전 필터**: prompt injection / 시크릿 추출 / 자해·자살 / 반복 abuse 즉시 차단 (LLM 비용 0)
- **시스템 프롬프트 SECURITY_GUARD**: 진로 외 거부, 시스템 정보 노출 금지, 인젝션 시 거부 후 본 주제 유도, 자해 시 1393/1388/1577-0199 안내
- **출력 redact**: API 키/JWT/DB URL/환경변수 패턴이 응답에 섞이면 `[REDACTED]`
- 메타블록 토큰 스트리밍 검열 (학생에게 raw JSON 노출 차단)

### HTTP/네트워크
- HTTPS (Caddy 자동 인증서)
- **Helmet**: HSTS 1년, X-Frame-Options:DENY, nosniff, X-Powered-By 제거, Referrer-Policy
- **CSP enforce**: script-src 외부화(unsafe-inline 제거), frame-ancestors:'none', object-src:'none', form-action:'self', upgrade-insecure-requests
- CORS 화이트리스트 + credentials
- Rate limit: 전역 100/min, 로그인 5/min/IP, AI 30/min/user

### 로깅·감사
- pino 구조화 로그 + traceId
- **PII/시크릿 redact**: password/token/apiKey/email/name 자동 `[REDACTED]`
- AuditLog: 학생 조회, 진로 변경, 새 IP 로그인, 비번 변경 등 민감 행위

### 파일
- PDF 서명 URL **5분 만료** (이전 1h에서 단축)
- HMAC-SHA256 서명, 만료된 URL은 거부

### 정보주체 권리 (PIPA 준수)
- 비밀번호 변경: `PATCH /v1/auth/password` (마이페이지)
- 계정 삭제: `DELETE /v1/auth/me` (비번 재확인) → cascade로 모든 개인 데이터 삭제
- 동의 항목 확인·관리: 마이페이지 > 동의 관리

## 3. 백업 · 복구

### 데이터 위치
- **PostgreSQL**: AWS RDS (ap-northeast-2, Single-AZ → Multi-AZ 권장)
- **Redis**: docker 컨테이너(휘발성 — 캐시·SSE 팬아웃·잠금 카운터만, 영속 데이터 없음)
- **파일(PDF)**: docker volume `storage/` (운영) — 추후 S3 이전 예정

### 백업 정책
| 대상 | 방법 | 주기 | 보존 | RPO | RTO |
|---|---|---|---|---|---|
| RDS | AWS 자동 백업 (스냅샷) | 매일 (KST 03~05시) | **30일** | 24h | 1h |
| RDS | 트랜잭션 로그 | 5분 단위 | 30일 | 5분 | 1h |
| 파일(PDF) | EC2 vhdx 스냅샷 | 매일 | 7일 | 24h | 2h |
| 코드/마이그레이션 | GitHub | 푸시마다 | 영구 | 0 | 즉시 |

**복구 절차** (재해 발생 시):
1. 사고 인지 → 사고 채널 개설(메일/슬랙)
2. RDS Point-in-Time Restore (대시보드 → 인스턴스 선택 → "복원")
3. 새 인스턴스에 `DATABASE_URL` 변경 후 `bash deploy/run-prod.sh`
4. 학생/교사 영향 범위 산정 → 영향 받은 사용자에게 안내
5. 사고 보고서 작성 (24h 내)

**테스트**: 분기 1회 dev 환경에 RDS 스냅샷 복원해 동작 확인 (RTO 검증).

## 4. 개인정보 영향평가 (PIA — 요약)

### 처리 항목
| 항목 | 필수/선택 | 보관 | 목적 |
|---|---|---|---|
| 이메일 | 필수 | 탈퇴 시 삭제 | 로그인·알림 |
| 비밀번호 해시 (bcrypt) | 필수 | 탈퇴 시 삭제 | 인증 |
| 이름 | 필수 | 탈퇴 시 삭제 | 표시 |
| 학교·학급 | 선택(교사 필수) | 탈퇴 시 삭제 | 학급 매칭 |
| 학년 | 선택(학생) | 탈퇴 시 삭제 | AI 톤 분기 |
| 성적 | 학생 자율 입력 | 탈퇴 시 삭제 | AI 진로 분석 |
| AI 상담 대화 | 자동 | 탈퇴 시 삭제 | 상담 맥락·리포트 |
| 진로 단서 | 자동 (AI 추출) | 탈퇴 시 삭제 | 리포트·교사 코칭 |
| 진로 목표 | 학생 자율 | 탈퇴 시 삭제 | 추천·교사 알림 |
| 동의 기록 (consents) | 필수 | 탈퇴 시 삭제 | 법적 근거 증빙 |
| 로그인 IP/UA | 자동 (Redis) | 90일 후 삭제 | 의심 활동 감지 |
| AuditLog | 자동 | 1년 후 삭제(예정) | 감사 |

### 처리 흐름
1. 가입 시 동의 항목(tos/privacy/academic/ai/age) 명시 — 만 14세 미만 차단
2. 데이터는 AWS 서울 리전에만 저장 (해외 이전 없음)
3. 학생 데이터는 본인 + 같은 학급 담임 교사 + 관리자만 접근
4. AI 상담 대화는 Anthropic API로 전송 (Anthropic 정책에 따라 학습에 사용되지 않음 — Zero Data Retention 옵션 검토)
5. 탈퇴 시 즉시 cascade 삭제 — 30일 복구 유예 없음(즉시 영구 삭제)

### 위험 평가
| 위험 | 영향도 | 가능성 | 대응 |
|---|---|---|---|
| 교사가 본인 학급 외 학생 조회 시도 | 중 | 낮음 | 학교·학급 매칭으로 차단 + AuditLog |
| 학생 본인 외 계정 탈취 | 높음 | 낮음 | bcrypt + 잠금 + family 추적 + 새 IP 알림 |
| AI에 학생 데이터를 통해 시스템 정보 추출 | 중 | 중 | 4중 LLM 가드 (입력 필터·시스템 프롬프트·출력 redact·자원 보호) |
| 미성년자 자해 시그널 미감지 | 매우 높음 | 낮음 | 입력 필터에서 즉시 1393/1388 안내 (LLM 거치지 않음) |
| 데이터 유출 후 인지 지연 | 높음 | 낮음 | AuditLog + 새 IP 알림으로 사용자 본인 감지 |
| 백업 실패 → 데이터 손실 | 매우 높음 | 매우 낮음 | RDS 자동 백업 + 분기 복구 테스트 |

### 미성년자 보호 강화
- 만 14세 미만 가입 차단 (consents.age 필수)
- AI 상담에서 자해·자살 키워드 즉시 1393(자살예방)/1388(청소년)/1577-0199(정신건강) 안내
- 시스템 프롬프트에 미성년자 대상 톤 명시 — 정치/종교/성인 콘텐츠 거부
- 교사·관리자의 학생 데이터 접근은 자동 AuditLog (학생 본인은 모름이 아니라 → 추후 학생에게도 공개 권장)

## 5. 다음 단계 (계획)

- [ ] RDS Multi-AZ 전환 (RTO 단축)
- [ ] S3 + presigned URL (vhdx 의존성 제거)
- [ ] CSP의 `style-src` `unsafe-inline` 제거 (React inline style 점진적 nonce)
- [ ] AI 대화 → Anthropic Zero Data Retention 옵션 적용
- [ ] 침해사고 대응 절차서 (incident playbook)
- [ ] 외부 보안 점검 (모의해킹) — 사업자 등록 후

---

문서 최종 수정: 2026-06 (자동 생성). 분기 1회 리뷰.
