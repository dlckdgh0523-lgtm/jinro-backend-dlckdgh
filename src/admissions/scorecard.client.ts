import { env } from '../common/env';
import { logger } from '../common/logger';

// 미국 College Scorecard (api.data.gov) — 미국 대학 통계 (학비/입학률/졸업률/중위소득).
// 무료, 1000 req/h. 응답 JSON. 한국 학생 미국 유학 결정 지원용 데이터.
// 매핑: ForeignUniversity.nameEn 또는 명칭 유사도로 결합.

export interface ScorecardSchool {
  id: number; // scorecard ID
  name: string;
  city: string | null;
  state: string | null;
  admissionRate: number | null; // 0~1
  studentSize: number | null;
  tuitionInState: number | null;
  tuitionOutState: number | null;
  medianEarnings: number | null;
  completionRate: number | null;
  raw: Record<string, unknown>;
}

const FIELDS = [
  'id',
  'school.name',
  'school.city',
  'school.state',
  'latest.admissions.admission_rate.overall',
  'latest.student.size',
  'latest.cost.tuition.in_state',
  'latest.cost.tuition.out_of_state',
  'latest.earnings.6_yrs_after_entry.median',
  'latest.completion.completion_rate_4yr_150nt',
].join(',');

export class ScorecardClient {
  get enabled(): boolean {
    return env().SCORECARD_API_KEY !== '';
  }

  private async page(pageNo: number, perPage: number, q?: string): Promise<{ items: ScorecardSchool[]; total: number }> {
    const url = new URL(env().SCORECARD_BASE_URL);
    url.searchParams.set('api_key', env().SCORECARD_API_KEY);
    url.searchParams.set('fields', FIELDS);
    url.searchParams.set('page', String(pageNo));
    url.searchParams.set('per_page', String(perPage));
    // 4년제 학사 학위 수여 대학만 (predominant=3=학사 위주)
    url.searchParams.set('school.degrees_awarded.predominant', '3');
    // 미국 전체 (특정 주 제한 시 school.state=CA 등)
    if (q) url.searchParams.set('school.name', q);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (res.status >= 400) throw new Error(`scorecard http ${res.status}`);
      const json = (await res.json()) as { results: Record<string, unknown>[]; metadata: { total: number } };
      const items = (json.results ?? [])
        .map((r) => {
          const id = Number(r['id']);
          const name = String(r['school.name'] ?? '').trim();
          if (!Number.isFinite(id) || !name) return null;
          const num = (k: string): number | null => {
            const v = r[k];
            return typeof v === 'number' && Number.isFinite(v) ? v : null;
          };
          const item: ScorecardSchool = {
            id,
            name,
            city: (r['school.city'] as string) ?? null,
            state: (r['school.state'] as string) ?? null,
            admissionRate: num('latest.admissions.admission_rate.overall'),
            studentSize: num('latest.student.size'),
            tuitionInState: num('latest.cost.tuition.in_state'),
            tuitionOutState: num('latest.cost.tuition.out_of_state'),
            medianEarnings: num('latest.earnings.6_yrs_after_entry.median'),
            completionRate: num('latest.completion.completion_rate_4yr_150nt'),
            raw: r,
          };
          return item;
        })
        .filter((v): v is ScorecardSchool => v !== null);
      return { items, total: json.metadata?.total ?? 0 };
    } finally {
      clearTimeout(timer);
    }
  }

  /** 미국 4년제 학사대학 전체 — 페이지네이션 (기본 100건/페이지) */
  async fetchAll(maxPages = 30): Promise<ScorecardSchool[]> {
    const out: ScorecardSchool[] = [];
    let total = Infinity;
    for (let p = 0; p < maxPages && p * 100 < total; p++) {
      try {
        const { items, total: t } = await this.page(p, 100);
        total = t || total;
        if (!items.length) break;
        out.push(...items);
        await new Promise((r) => setTimeout(r, 100));
      } catch (e) {
        logger.warn({ page: p, err: (e as Error).message }, 'scorecard fetch page failed');
        break;
      }
    }
    logger.info({ collected: out.length, total }, 'scorecard fetched');
    return out;
  }
}
