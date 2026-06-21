import { z } from 'zod';

// env는 부팅 시 1회 zod로 검증한다. 누락 시 부팅 실패가 원칙이지만,
// 자율 빌드(키 부재) 환경을 위해 외부 자격증명은 전부 mock 기본값으로 폴백한다.
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://jinro:jinro@localhost:5432/jinro'),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  JWT_SECRET: z.string().min(16).default('dev-only-secret-change-me-0123456789'),
  JWT_ACCESS_TTL_SEC: z.coerce.number().default(15 * 60),
  JWT_REFRESH_TTL_SEC: z.coerce.number().default(14 * 24 * 3600),

  CORS_ORIGINS: z
    .string()
    .default('https://jinronavi.kr,https://admin.jinronavi.kr,http://localhost:5173,http://localhost:3000'),

  // 커리어넷 — 키 없으면 mock 서버를 가리킨다 (OPEN_QUESTIONS #4)
  CAREERNET_BASE_URL: z.string().url().default('https://www.career.go.kr'),
  CAREERNET_API_KEY: z.string().default(''),
  CAREERNET_TIMEOUT_MS: z.coerce.number().default(5000),

  // 대학알리미(공공데이터포털) — 키 없으면 해당 ingestion 소스 skip
  ALIMI_BASE_URL: z.string().url().default('https://apis.data.go.kr/B340014/BasicInformationService_2'),
  DATA_GO_KR_API_KEY: z.string().default(''),
  ALIMI_TIMEOUT_MS: z.coerce.number().default(8000),

  // 경기데이터드림 대학별 학과정보 (openapi.gg.go.kr/Univmjrm) — 키 없으면 CSV importer만 사용.
  // 주의: gg.go.kr은 한국 IP만 허용 — 해외 리전 배포 시 차단될 수 있음.
  GG_DATA_BASE_URL: z.string().url().default('https://openapi.gg.go.kr/Univmjrm'),
  GG_DATA_API_KEY: z.string().default(''),

  // 한국사회복지협의회 봉사활동(VMS) — data.go.kr 같은 키 재사용. 봉사처/모집 정보.
  VMS_BASE_URL: z.string().url().default('https://apis.data.go.kr/B460014/vmsdataview'),

  // 한국국제교류재단 해외대학 표준국문명칭 — data.go.kr 같은 키 재사용.
  OVERSEA_UNIV_BASE_URL: z.string().url().default('https://apis.data.go.kr/B260004/OverseaUnivKornameService2'),

  // 대학알리미 산학협력 현황 (현장실습/캡스톤 등) — data.go.kr 같은 키 재사용.
  ALIMI_INDUSTRY_BASE_URL: z.string().url().default('https://apis.data.go.kr/B340014/IndustryAcademicCooperationService'),

  // 워크넷(고용노동부 work24) — 서비스별로 키가 다름(자동승인 후 4개 발급). 키 없으면 해당 기능 skip.
  WORK24_BASE_URL: z.string().url().default('https://www.work24.go.kr/cm/openApi/call/wk'),
  WORK24_JOB_KEY: z.string().default(''),
  WORK24_MAJOR_KEY: z.string().default(''),
  WORK24_DUTY_KEY: z.string().default(''),
  WORK24_CMCD_KEY: z.string().default(''),

  // 미국 College Scorecard (api.data.gov) — 미국 대학 학비/입학률/졸업률/중위소득
  SCORECARD_BASE_URL: z.string().url().default('https://api.data.gov/ed/collegescorecard/v1/schools'),
  SCORECARD_API_KEY: z.string().default(''),

  // 행정안전부 1365 봉사참여정보서비스 (VMS 모집 폴백). 동일 data.go.kr 키 재사용.
  POLBONG_1365_BASE_URL: z.string().url().default('https://apis.data.go.kr/1262000/VolunteerService01_1'),

  // AI — 키 없으면 mock 스트림 (OPEN_QUESTIONS #5)
  AI_PROVIDER: z.enum(['mock', 'anthropic']).default('mock'),
  ANTHROPIC_API_KEY: z.string().default(''),
  AI_MODEL_LIGHT: z.string().default('claude-haiku-4-5-20251001'),
  AI_MODEL_HEAVY: z.string().default('claude-sonnet-4-6'),
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().default(8000), // 채팅 답변이 길어도 안 잘리게 (Haiku는 길게 답해도 됨; 4000도 표·목록 긴 답변에서 끊김)
  AI_MAX_REPORT_TOKENS: z.coerce.number().default(3000), // 리포트 합성(Sonnet)은 더 긴 출력 필요
  AI_MAX_INPUT_CHARS: z.coerce.number().default(24_000),
  AI_MAX_CONCURRENT_STREAMS: z.coerce.number().default(50),

  // 소셜 로그인 (OAuth) — 키 없으면 해당 버튼 비활성. redirect_uri는 요청 Host 기반(또는 OAUTH_REDIRECT_BASE).
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),
  KAKAO_REST_API_KEY: z.string().default(''),
  KAKAO_CLIENT_SECRET: z.string().default(''), // 카카오 "보안 > Client Secret" 사용 안 함이면 빈 값
  OAUTH_REDIRECT_BASE: z.string().default(''), // 예: https://도메인 (비우면 요청 Host로 자동 구성)

  // 스토리지 — S3 키 없으면 로컬 mock (OPEN_QUESTIONS #6)
  S3_BUCKET: z.string().default(''),
  S3_REGION: z.string().default('ap-northeast-2'),
  AWS_ACCESS_KEY_ID: z.string().default(''),
  AWS_SECRET_ACCESS_KEY: z.string().default(''),
  LOCAL_STORAGE_DIR: z.string().default('storage'),
  FILE_URL_SECRET: z.string().default('dev-file-url-secret'),
  PUBLIC_BASE_URL: z.string().default('http://localhost:3000'),

  // 부하 테스트 프로파일 전용 — 운영에서 켜지 말 것
  DISABLE_RATE_LIMIT: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),

  SENTRY_DSN: z.string().default(''),
  LOG_LEVEL: z.string().default('info'),

  PDF_WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(2).default(1),
  PDF_BROWSER_RESTART_EVERY: z.coerce.number().int().default(20),
  // 매일 04:00 — 봉사 등 자주 바뀌는 데이터
  INGEST_CRON: z.string().default('0 4 * * *'),
  // 매월 1일 03:00 — 학과정보처럼 잘 안 바뀌는 데이터 (사용자 요청: 한 달 or 6개월에 한 번)
  INGEST_MONTHLY_CRON: z.string().default('0 3 1 * *'),
  INGEST_ON_BOOT: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
});

export type Env = z.infer<typeof EnvSchema>;

let cached: Env | null = null;

export function loadEnv(overrides?: Partial<Record<string, string>>): Env {
  const parsed = EnvSchema.safeParse({ ...process.env, ...overrides });
  if (!parsed.success) {
    // 부팅 실패 — 어떤 키가 왜 틀렸는지 즉시 드러낸다 (값은 노출하지 않음)
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`env validation failed: ${issues}`);
  }
  cached = parsed.data;
  return parsed.data;
}

export function env(): Env {
  if (!cached) return loadEnv();
  return cached;
}

/** 테스트에서 env 캐시 재설정용 */
export function resetEnvForTest(): void {
  cached = null;
}
