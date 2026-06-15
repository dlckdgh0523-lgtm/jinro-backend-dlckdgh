# MEMORY.md — OPEN QUESTIONS · TODO · 다음 이터레이션

- [Real keys lost on restart](memory/real_keys_lost_on_restart.md) — ★"키 넣었는데 왜 mock?"의 근본원인: 셸 키가 재기동 때 소실. gitignore 런처로 영속화
- [Docker build stale (local)](memory/docker_build_stale_local.md) — ★이 머신 Docker가 최신 src 미반영. 로컬은 호스트 dist 바인드 마운트로 우회(배포 전 제거 필요)

## OPEN QUESTIONS (요약 — 상세는 docs/OPEN_QUESTIONS.md)
- 실제 커리어넷 apiKey 미확보 → mock fixture 기반. 실키 투입 시 normalize 필드 매핑 검증 필요 (#4)
- Anthropic 키 미확보 → AI_PROVIDER=mock 기본. 실키 투입 시 prompt caching 비용/시그널 품질 측정 필요 (#5)
- 입시 상세(경쟁률·컷)는 어디가/대학알리미 API 계약 필요 — 현재 confidence:'unavailable' 응답 (#8)

## TODO (사람 결정 필요)
1. 커리어넷 apiKey 발급 → CAREERNET_BASE_URL=https://www.career.go.kr + CAREERNET_API_KEY 주입 → ingestion 1회 돌려 실데이터 정규화 확인
2. ANTHROPIC_API_KEY 주입 + AI_PROVIDER=anthropic → 시그널 추출/리포트 품질 평가, 토큰 비용 대시보드
3. S3 버킷 결정 시 common/storage.ts put/getSignedUrl만 S3 SDK로 교체 (인터페이스 이미 고정)
4. Sentry DSN 발급 시 @sentry/node 의존성 추가 + common/sentry.ts 실구현
5. OAuth(Google/Kakao) 콜백 URL 등록 + §1 잔여 라우트(비밀번호 재설정 메일 인프라)

## 다음 이터레이션 후보
- **임베딩 교체**: 현재 해시 임베딩(결정적, 품질 베이스라인). 한국어 품질 필요 시 bge-m3/voyage 등으로 교체 —
  README §2에 따라 둘째 구현이 생길 때 인터페이스 도입 (지금은 단일 구현 유지)
- 성적(§4) → AI 입시 격차 분석(§5 analysis) 연결
- 메시지/캘린더/알림 트리거 확장 (§6~§8의 나머지 이벤트 타입)
- 검사(진로심리검사) 문항/리포트 프록시 — 검사번호별 포맷 함정(24·25번 쉼표 3개, 32번 더미문항) 주의
- k6-operator 기반 k8s 분산 부하 (load/k8s/ — 매니페스트만 있음, 실행은 클러스터 확보 후)
- nginx/리버스프록시 도입 시 SSE 체크리스트(RUNBOOK §6) 적용
