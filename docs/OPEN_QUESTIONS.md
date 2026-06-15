# OPEN_QUESTIONS.md — 가정으로 넘어간 것 (사람이 결정할 것)

## #1 빌드 범위 — backend-integration.md 전체 vs 미션 책임 3가지
- **무엇**: 프론트 사양서(backend-integration.md)는 성적·메시지·캘린더·결제·어드민 등 전 제품 API(~80개)를 정의하지만, 미션은 백엔드 책임을 (1) 커리어넷 프록시 (2) AI 상담 SSE (3) PDF 리포트로 한정.
- **가정**: 미션 책임 3가지 + 전제 인프라(JWT 인증, 알림 SSE, 입시 조회, health)만 이번 빌드에서 구현. 나머지는 FRONTEND_CONTRACT.md "차기 범위"로 문서화.
- **왜**: 미션 DoD가 3책임 중심이고, 결제는 "PG 미연동 시 fake success 절대 금지" 원칙상 구현 불가. 품질(카오스 테스트·부하검증) > 폭.

## #2 에러 응답 형태 충돌
- **무엇**: 미션 표준 `{error:{code,message,traceId}}` vs 프론트 클라이언트는 최상위 `{code,message,details}` 읽음(app-runtime.jsx:147-149).
- **가정**: 두 형태 병합 반환 `{code,message,traceId,details?,error:{...}}`. 프론트 수정 없이 동작 + 미션 규약 충족.

## #3 PDF 책임 분리
- **무엇**: 프론트는 jsPDF+html2canvas로 어드민 테이블을 클라이언트에서 PDF화(admin-export.jsx). 서버 PDF의 대상이 명시 안 됨.
- **가정**: 서버 PDF = AI 진로 리포트(차트 포함, 한글 폰트, Playwright 렌더). 어드민 테이블 export는 프론트 잔존.

## #4 커리어넷 apiKey 부재 — ✅ 해소 (2026-06-12, 사용자 키 제공)
- 실 API 검증 완료, 매핑 8건 수정(DECISIONS #38~#44). 실데이터 적재: 직업 552·학과 501·학교 472·상담 188·주니어 300.
- 키는 셸 env로만 주입(코드/파일 미저장). mock은 실 API 형태로 갱신되어 테스트가 실매핑을 검증.

## #5 Anthropic 키 — ✅ 해소 (2026-06-13, 사용자 키 제공)
- `AI_PROVIDER=anthropic` + 셸 env(ANTHROPIC_API_KEY)로 검증 완료. Haiku 상담·시그널, Sonnet 리포트, prompt caching 모두 동작.
- 실키 검증으로 토큰상한 버그 발견·수정(AI_MAX_OUTPUT_TOKENS가 리포트도 잘라 JSON 파싱 실패 → heavy 전용 상한 분리, parseReportJson 견고화).
- 키는 셸 env로만 주입(.env 미사용 — 하드스톱). 채팅 노출 키는 재발급 권장. OpenAI fallback(§3)은 여전히 차기.

## #6 S3 부재
- **가정**: 로컬 mock 스토리지(`storage/` 디렉터리) + presigned-유사 서명 URL(`/v1/files/:key?expires=&sig=`, HMAC). S3 키 투입 시 S3Storage로 전환 (동일 인터페이스).

## #7 OAuth(Google/Kakao)·메일(비밀번호 재설정)
- **가정**: 외부 자격증명+콜백 URL 등록이 필요한 영역이라 mock도 계약 검증 가치가 낮음 → 차기 범위. 라우트는 501 NOT_IMPLEMENTED 표준 에러로 예약.

## #8 admissions 입시 상세 — ✅ 부분 해소 (2026-06-13, 대학알리미 StudentService 연동)
- **경쟁률·신입생 충원율·등록률**: 대학알리미 입시통계 API로 184개 대학 confidence:'confirmed' 제공(대학 단위).
- **학과 목록**: 대학별 학과 48,308행 CSV 적재(svyYr 버전).
- **남은 것(차기)**: ① 학과 '단위' 모집인원·경쟁률·컷(현재는 대학 단위만, recruit=null) — 학과별 입시결과 공시/어디가 API 필요 ② 미매칭 대학(184/472)은 unavailable — 이름 매칭 정교화 또는 schlId 직접 연계로 개선 여지.

## #9 검사(진로심리검사) 위임
- **가정**: v2 목록(`/v1/career/tests`)만 프록시. 문항 제출/리포트는 검사번호별 포맷 함정(쉼표 3개 등)이 커서 실키 확보 후 구현. prompt.md의 AI 도구도 검사 결과를 <context>로 받는 설계라 백엔드 검사 API 의존이 낮음.

## #10 Node 24 사용
- **가정**: 미션은 Node 22 LTS이나 머신에 24.11.0 설치됨. 24도 LTS(2026-06 기준)이고 기능 상위호환 → 24 사용, engines는 >=22로 명시.
