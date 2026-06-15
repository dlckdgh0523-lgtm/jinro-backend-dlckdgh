import { XMLParser } from 'fast-xml-parser';
import CircuitBreaker from 'opossum';
import pRetry, { AbortError } from 'p-retry';
import { decodeCareernetBytes } from './decode';
import { env } from '../common/env';
import { AppError, ErrorCode } from '../common/errors';
import { logger } from '../common/logger';

// 커리어넷 HTTP 클라이언트 — HTTPS 고정, apiKey는 env에서만,
// 타임아웃 + p-retry 지수백오프 + opossum 서킷브레이커 (DECISIONS #16).
// 두 계열: JSON(/cnet/front/openapi/*, /inspct/openapi/v2/*) vs EUC-KR XML(getOpenApi).

export interface CareernetFetchResult {
  kind: 'json' | 'xml';
  data: unknown;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false, // 숫자/불리언 자동 변환 금지 — "012" 같은 코드 보존, 정제는 sanitize에서
  trimValues: true,
});

async function fetchBytes(url: URL, timeoutMs: number): Promise<{ bytes: Buffer; contentType: string | null; status: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: '*/*' } });
    const ab = await res.arrayBuffer();
    return { bytes: Buffer.from(ab), contentType: res.headers.get('content-type'), status: res.status };
  } finally {
    clearTimeout(timer);
  }
}

export class CareernetClient {
  private breaker: CircuitBreaker<[URL, 'json' | 'xml'], CareernetFetchResult>;

  constructor() {
    this.breaker = new CircuitBreaker(
      (url: URL, kind: 'json' | 'xml') => this.fetchWithRetry(url, kind),
      {
        timeout: env().CAREERNET_TIMEOUT_MS * 3 + 2_000, // 재시도 포함 총 시간 상한
        errorThresholdPercentage: 50,
        resetTimeout: 10_000,
        volumeThreshold: 5,
      },
    );
    this.breaker.on('open', () => logger.warn('careernet circuit OPEN'));
    this.breaker.on('halfOpen', () => logger.info('careernet circuit half-open'));
    this.breaker.on('close', () => logger.info('careernet circuit closed'));
  }

  private buildUrl(path: string, params: Record<string, string | number | undefined>): URL {
    const base = env().CAREERNET_BASE_URL;
    // HTTPS 고정 — http로 설정돼도 승격한다. 단 로컬 mock(localhost/127.*/host.docker.internal)은 예외.
    const url = new URL(path, base);
    const isLocal = /^(localhost|127\.|host\.docker\.internal|mock-careernet)/.test(url.hostname);
    if (url.protocol === 'http:' && !isLocal) url.protocol = 'https:';
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    }
    if (env().CAREERNET_API_KEY) {
      url.searchParams.set('apiKey', env().CAREERNET_API_KEY);
      // inspct(심리검사) 계열은 소문자 apikey를 요구한다 (실 API 검증으로 확인) — 둘 다 전송
      url.searchParams.set('apikey', env().CAREERNET_API_KEY);
    }
    return url;
  }

  private async fetchWithRetry(url: URL, kind: 'json' | 'xml'): Promise<CareernetFetchResult> {
    return pRetry(
      async () => {
        let r: Awaited<ReturnType<typeof fetchBytes>>;
        try {
          r = await fetchBytes(url, env().CAREERNET_TIMEOUT_MS);
        } catch (e) {
          if ((e as Error).name === 'AbortError') {
            throw new AppError(ErrorCode.CAREERNET_UPSTREAM_TIMEOUT, '진로정보 서버 응답이 지연되고 있어요.', { cause: e });
          }
          throw new AppError(ErrorCode.CAREERNET_UPSTREAM_ERROR, '진로정보 서버에 연결하지 못했어요.', { cause: e });
        }
        if (r.status === 404) {
          // 재시도 무의미 — 즉시 중단
          throw new AbortError(new AppError(ErrorCode.CAREERNET_NOT_FOUND, '요청한 진로정보를 찾을 수 없어요.'));
        }
        if (r.status >= 400) {
          throw new AppError(ErrorCode.CAREERNET_UPSTREAM_ERROR, '진로정보 서버 오류가 발생했어요.', {
            details: undefined,
            cause: new Error(`upstream status ${r.status}`),
          });
        }
        return this.parse(r.bytes, r.contentType, kind);
      },
      {
        retries: 2,
        factor: 2,
        minTimeout: 300,
        maxTimeout: 2_000,
        onFailedAttempt: (err) => {
          logger.warn({ url: url.pathname, attempt: err.attemptNumber, left: err.retriesLeft, msg: err.message }, 'careernet retry');
        },
      },
    );
  }

  private parse(bytes: Buffer, contentType: string | null, kind: 'json' | 'xml'): CareernetFetchResult {
    if (kind === 'json') {
      try {
        return { kind, data: JSON.parse(bytes.toString('utf8')) };
      } catch (e) {
        throw new AppError(ErrorCode.CAREERNET_PARSE_ERROR, '진로정보 응답을 해석하지 못했어요.', { cause: e });
      }
    }
    // EUC-KR XML — 바이트 → 디코딩 → 파싱
    const text = decodeCareernetBytes(bytes, contentType);
    if (!text.trim()) {
      throw new AppError(ErrorCode.CAREERNET_PARSE_ERROR, '진로정보 응답이 비어 있어요.');
    }
    try {
      return { kind, data: xmlParser.parse(text) };
    } catch (e) {
      throw new AppError(ErrorCode.CAREERNET_PARSE_ERROR, '진로정보 응답을 해석하지 못했어요.', { cause: e });
    }
  }

  private async fire(url: URL, kind: 'json' | 'xml'): Promise<CareernetFetchResult> {
    try {
      return await this.breaker.fire(url, kind);
    } catch (e) {
      if (e instanceof AppError) throw e;
      if ((e as Error).message?.includes('Breaker is open')) {
        throw new AppError(ErrorCode.CAREERNET_CIRCUIT_OPEN, '진로정보 서버가 불안정해 잠시 차단됐어요. 곧 복구돼요.', { cause: e });
      }
      if ((e as Error).message?.toLowerCase().includes('timed out')) {
        throw new AppError(ErrorCode.CAREERNET_UPSTREAM_TIMEOUT, '진로정보 서버 응답이 지연되고 있어요.', { cause: e });
      }
      throw new AppError(ErrorCode.CAREERNET_UPSTREAM_ERROR, '진로정보 서버 오류가 발생했어요.', { cause: e });
    }
  }

  /** JSON 계열 */
  async getJson(path: string, params: Record<string, string | number | undefined> = {}): Promise<unknown> {
    const result = await this.fire(this.buildUrl(path, params), 'json');
    return result.data;
  }

  /** EUC-KR XML 계열 (getOpenApi) */
  async getXml(svcCode: string, params: Record<string, string | number | undefined> = {}): Promise<unknown> {
    const result = await this.fire(
      this.buildUrl('/cnet/openapi/getOpenApi', { svcType: 'api', svcCode, gubun: params['gubun'], ...params }),
      'xml',
    );
    return result.data;
  }

  get circuitState(): 'open' | 'halfOpen' | 'closed' {
    if (this.breaker.opened) return 'open';
    if (this.breaker.halfOpen) return 'halfOpen';
    return 'closed';
  }
}
