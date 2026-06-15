# LOAD_TEST_REPORT.md — k6 + SSE 부하 검증 결과

> 실행: 2026-06-12, Docker Desktop(Windows) 단일 호스트.
> 스택: docker compose (api ×1, worker ×1, postgres pgvector, redis7, mock-careernet).
> 외부는 전부 mock 고정(커리어넷 fixture, AI mock 토큰 스트림) — 백엔드 자체 성능만 측정.
> 부하 프로파일: `docker-compose.load.yml` 오버레이(DISABLE_RATE_LIMIT=true, AI 동시 스트림 상한 600).
> 원본: load/results/*.json, *.log

## 실행 방법
```bash
docker compose -f docker-compose.yml -f docker-compose.load.yml up -d
docker compose -f docker-compose.yml -f docker-compose.load.yml --profile load run --rm k6 run /load/k6/rest.js
docker compose -f docker-compose.yml -f docker-compose.load.yml --profile load run --rm sse-load
docker compose -f docker-compose.yml -f docker-compose.load.yml --profile load run --rm k6 run /load/k6/pdf.js
docker compose -f docker-compose.yml -f docker-compose.load.yml --profile load run --rm k6 run /load/k6/soak.js
```
(k8s 분산은 load/k8s/k6-rest-testrun.yaml — k6-operator, 실행법은 파일 주석)

## 1. REST — 직업/학과/학교/입시 조회 ramp (0→150 VU, 100s)

| 지표 | 결과 | 임계치 | 판정 |
|---|---|---|---|
| 처리량 | **404 req/s** (총 38,039) | - | - |
| p50 / p90 / p95 | 4.1ms / 9.6ms / **14.0ms** | p95 < 300ms | ✅ |
| 최대 지연 | 140ms | - | - |
| 에러율 | **0.00%** (0/38,039) | < 1% | ✅ |
| checks(응답 모양) | 100% (76,076/76,076) | > 99% | ✅ |

- 적재(DB) 경로 + Redis 캐시 + single-flight이 효과적 — 커리어넷 mock으로의 유출 호출 없음(스탬피드 방지는 통합테스트에서 20동시→1회로 별도 검증).
- 첫 실행에서 rate limit(전역 100/min)이 96.9% 429를 만들었음 — **rate limit이 동작한다는 부수 증명**. 부하 프로파일에서만 해제.

## 2. SSE — AI 스트리밍 동시연결 ramp 50→150→300→500 (각 30s)

| 동시연결 | 스트림 수 | 완료 | **드롭** | 처리량/s | TTFT p50/p95/p99 (ms) | 전체 p50/p95 (ms) |
|---|---|---|---|---|---|---|
| 50 | 2,804 | 100% | **0** | 93.5 | 123 / 174 / 255 | 554 / 650 |
| 150 | 2,950 | 100% | **0** | 98.3 | 368 / 519 / 1,534 | 1,611 / 1,821 |
| 300 | 3,026 | 100% | **0** | 100.9 | 719 / 1,185 / 7,227 | 3,167 / 3,443 |
| 500 | 3,084 | 100% | **0** | 102.8 | 999 / 11,226 / 23,088 | 4,428 / 14,287 |

- 임계치 **SSE drop = 0 충족** (전 구간). 연결 거부·중간 끊김·error 이벤트 0.
- **동시성 한계(단일 인스턴스)**: ~300 동시까지 TTFT p95 1.2s 이내로 건전. 500에서 처리량은 ~103/s로 포화 상태에서 대기열이 길어져 TTFT p95 11s — 처리량 한계는 ≈100 스트림/s(메시지당 DB 5~6쿼리 + mock 토큰 60~90개 페이싱).
- 측정 도구: tools/sse-load.ts (Node) — AI 스트림이 POST 응답 SSE라 xk6-sse(GET/EventSource 중심) 부적합 (DECISIONS #36).

## 3. PDF — 동시 생성 spike 50건

| 지표 | 결과 | 임계치 | 판정 |
|---|---|---|---|
| 완료 | **50/50** | 실패 0 | ✅ |
| 실패(pdf_failed) | **0** | 0 | ✅ |
| HTTP 에러율 | 0% (0/1,404) | < 1% | ✅ |
| 대기시간(enqueue→done) | 평균 18.1s, p95 33.2s, 최대 35.6s | - | - |
| PDF 무결성 | 50/50 `%PDF-` 매직 + presigned URL 다운로드 | - | ✅ |

- 워커 동시성 1(미션 규칙 1~2)로 50건 spike를 **큐가 전부 흡수** — 건당 렌더 ~0.7s, 선형 드레인.
- 워커 메모리: spike 전후 안정(§4 soak 표 참고), OOM/브라우저 크래시/스톨 없음. 20잡마다 브라우저 재시작 가드 동작.

## 4. soak — 40 VU 혼합 부하 12분 (메모리 누수·좀비 확인)

| 지표 | 결과 | 임계치 | 판정 |
|---|---|---|---|
| 처리량 | 103.9 req/s (총 70,931) | - | - |
| p90 / p95 | 7.5ms / **9.9ms** | p95 < 400ms | ✅ |
| 에러율 / 중단 | **0.00%** / interrupted 0 | < 1% | ✅ |
| checks | 100% (70,930/70,930) | - | ✅ |
| api RSS | 109.5 → 110 → 112 → **113.4MB** (12분, +3.9MB 후 평탄) | 단조 증가 없음 | ✅ |
| worker RSS | 168.4 → **168.6MB** (사실상 고정) | 단조 증가 없음 | ✅ |

- 좀비 프로세스 없음(컨테이너 프로세스 수 변동 없음), 지연 드리프트 없음 — 누수 징후 없음.

## 병목과 개선 제안
1. **AI 스트림 처리량 ≈100/s (단일 인스턴스)** — 메시지당 DB 라운드트립(메시지 2 insert + 시그널 + 히스토리 + progress 2쿼리)이 지배적. 개선: progress 계산 캐시, 히스토리 윈도우 쿼리 1회화, 수평 확장(이미 Pub/Sub 팬아웃 구조라 인스턴스 추가만으로 확장).
2. **PDF 처리량 ~1.2/s** — 동시성 1 기준. 트래픽 증가 시 워커 replica 수평 확장(브라우저는 워커당 1개 유지)이 정석. 동시성 2 + 메모리 2GB로 약 2배 여유.
3. **500 동시 SSE에서 TTFT 악화** — 상한(AI_MAX_CONCURRENT_STREAMS)이 가드 역할. 운영은 인스턴스당 300 권장, 초과는 429(AI_TOO_MANY_STREAMS)로 빠른 실패가 사용자 경험상 낫다.
4. 실 Anthropic 연결 시 TTFT는 모델 지연이 지배 — 본 결과는 백엔드 오버헤드 하한선으로 해석할 것.
