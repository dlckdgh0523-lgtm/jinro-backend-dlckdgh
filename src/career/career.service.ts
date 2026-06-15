import { Injectable } from '@nestjs/common';
import { CareernetClient } from './careernet.client';
import { CacheService, TTL } from './cache';
import {
  normalizeCounselCases,
  normalizeEduMaterials,
  normalizeJobDetail,
  normalizeJobsList,
  normalizeJuniorJobsList,
  normalizeMajors,
  normalizeSchools,
  normalizeTests,
} from './normalize';
import type { NormalizedJob, NormalizedMajor } from './types';
import { PrismaService } from '../db/prisma.service';
import { AppError, ErrorCode } from '../common/errors';

// 런타임은 커리어넷에 직접 의존하지 않는다 — ingestion으로 적재된 DB를 1차 소스로,
// 적재 전(콜드 스타트)에만 live(캐시+single-flight) 폴백.

export interface ListMeta {
  nextCursor: number | null;
  total: number | null;
  source: 'db' | 'live';
  updatedAt: string | null;
}

const SOURCE_LABEL = '커리어넷 진로정보망 (career.go.kr)';

@Injectable()
export class CareerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly client: CareernetClient,
    private readonly cache: CacheService,
  ) {}

  // ─── 직업백과 ───

  async listJobs(q: string | undefined, theme: string | undefined, cursor: number | undefined, limit: number) {
    const where = {
      ...(q ? { name: { contains: q } } : {}),
      ...(theme ? { theme: { contains: theme } } : {}),
      ...(cursor ? { seq: { gt: cursor } } : {}),
    };
    const rows = await this.prisma.careerJob.findMany({ where, orderBy: { seq: 'asc' }, take: limit + 1 });
    if (rows.length > 0 || (await this.prisma.careerJob.count()) > 0) {
      const page = rows.slice(0, limit);
      return {
        data: page.map((r) => this.jobRowToDto(r)),
        meta: this.dbMeta(rows.length > limit ? (page[page.length - 1]?.seq ?? null) : null, await this.prisma.careerJob.count({ where: { ...(q ? { name: { contains: q } } : {}), ...(theme ? { theme: { contains: theme } } : {}) } }), page[0]?.updatedAt ?? null),
      };
    }
    // 콜드 스타트 폴백 — live
    const { value } = await this.cache.getOrLoad(`career:jobs:${q ?? ''}:${theme ?? ''}`, TTL.jobs, async () => {
      const raw = await this.client.getJson('/cnet/front/openapi/jobs.json', { searchJobNm: q, pageIndex: 1, pageUnit: 200 });
      return normalizeJobsList(raw);
    });
    let items = value.items;
    if (q) items = items.filter((j) => j.name.includes(q) || (j.summary ?? '').includes(q));
    if (theme) items = items.filter((j) => (j.theme ?? '').includes(theme));
    if (cursor) items = items.filter((j) => j.seq > cursor);
    const page = items.slice(0, limit);
    return {
      data: page.map((j) => this.jobToDto(j)),
      meta: this.liveMeta(items.length > limit ? (page[page.length - 1]?.seq ?? null) : null, value.total),
    };
  }

  async getJob(seq: number) {
    const row = await this.prisma.careerJob.findUnique({ where: { seq } });
    if (row) return { data: this.jobRowToDto(row), meta: this.dbMeta(null, null, row.updatedAt) };
    const { value } = await this.cache.getOrLoad(`career:job:${seq}`, TTL.jobs, async () => {
      const raw = await this.client.getJson('/cnet/front/openapi/job.json', { seq });
      return normalizeJobDetail(raw);
    });
    if (!value) throw new AppError(ErrorCode.CAREERNET_NOT_FOUND, '해당 직업 정보를 찾을 수 없어요.');
    return { data: this.jobToDto(value), meta: this.liveMeta(null, null) };
  }

  // ─── 주니어직업 ───

  async listJuniorJobs(q: string | undefined, cursor: number | undefined, limit: number) {
    const dbCount = await this.prisma.juniorJob.count();
    if (dbCount > 0) {
      const where = { ...(q ? { name: { contains: q } } : {}), ...(cursor ? { seq: { gt: cursor } } : {}) };
      const rows = await this.prisma.juniorJob.findMany({ where, orderBy: { seq: 'asc' }, take: limit + 1 });
      const page = rows.slice(0, limit);
      return {
        data: page.map((r) => ({ seq: r.seq, name: r.name, field: r.field, summary: r.summary })),
        meta: this.dbMeta(rows.length > limit ? (page[page.length - 1]?.seq ?? null) : null, dbCount, page[0]?.updatedAt ?? null),
      };
    }
    const { value } = await this.cache.getOrLoad(`career:junior:${q ?? ''}`, TTL.juniorJobs, async () => {
      const raw = await this.client.getJson('/cnet/front/openapi/juniorjobsinfo.json', { searchJobNm: q, pageIndex: 1, pageUnit: 200 });
      return normalizeJuniorJobsList(raw);
    });
    let items = value.items;
    if (q) items = items.filter((j) => j.name.includes(q));
    if (cursor) items = items.filter((j) => j.seq > cursor);
    const page = items.slice(0, limit);
    return {
      data: page.map((j) => ({ seq: j.seq, name: j.name, field: j.field, summary: j.summary })),
      meta: this.liveMeta(items.length > limit ? (page[page.length - 1]?.seq ?? null) : null, value.total),
    };
  }

  async getJuniorJob(seq: number) {
    const row = await this.prisma.juniorJob.findUnique({ where: { seq } });
    if (row) {
      return { data: { seq: row.seq, name: row.name, field: row.field, summary: row.summary }, meta: this.dbMeta(null, null, row.updatedAt) };
    }
    const { value } = await this.cache.getOrLoad(`career:juniorjob:${seq}`, TTL.juniorJobs, async () => {
      const raw = await this.client.getJson('/cnet/front/openapi/juniorjobinfo.json', { seq });
      const page = normalizeJuniorJobsList({ juniorJobsInfo: [raw && typeof raw === 'object' && 'juniorJobInfo' in (raw as object) ? (raw as Record<string, unknown>)['juniorJobInfo'] : raw] });
      return page.items[0] ?? null;
    });
    if (!value) throw new AppError(ErrorCode.CAREERNET_NOT_FOUND, '해당 직업 정보를 찾을 수 없어요.');
    return { data: { seq: value.seq, name: value.name, field: value.field, summary: value.summary }, meta: this.liveMeta(null, null) };
  }

  // ─── 학과 (EUC-KR XML) ───

  async listMajors(q: string | undefined, cursor: number | undefined, limit: number) {
    const dbCount = await this.prisma.major.count();
    if (dbCount > 0) {
      const where = { ...(q ? { name: { contains: q } } : {}), ...(cursor ? { majorSeq: { gt: cursor } } : {}) };
      const rows = await this.prisma.major.findMany({ where, orderBy: { majorSeq: 'asc' }, take: limit + 1 });
      const page = rows.slice(0, limit);
      return {
        data: page.map((r) => this.majorRowToDto(r)),
        meta: this.dbMeta(rows.length > limit ? (page[page.length - 1]?.majorSeq ?? null) : null, dbCount, page[0]?.updatedAt ?? null),
      };
    }
    const { value } = await this.cache.getOrLoad(`career:majors:${q ?? ''}`, TTL.majors, async () => {
      // 실 API: MAJOR는 gubun 없으면 빈 응답 (univ_list=대학 학과)
      const raw = await this.client.getXml('MAJOR', { gubun: 'univ_list', searchTitle: q, thisPage: 1, perPage: 500 });
      return normalizeMajors(raw);
    });
    let items = value.items;
    if (q) items = items.filter((m) => m.name.includes(q));
    if (cursor) items = items.filter((m) => m.majorSeq > cursor);
    const page = items.slice(0, limit);
    return {
      data: page.map((m) => this.majorToDto(m)),
      meta: this.liveMeta(items.length > limit ? (page[page.length - 1]?.majorSeq ?? null) : null, value.total),
    };
  }

  async getMajor(majorSeq: number) {
    const row = await this.prisma.major.findUnique({ where: { majorSeq } });
    if (row) return { data: this.majorRowToDto(row), meta: this.dbMeta(null, null, row.updatedAt) };
    const { value } = await this.cache.getOrLoad(`career:major:${majorSeq}`, TTL.majors, async () => {
      const raw = await this.client.getXml('MAJOR_VIEW', { majorSeq });
      return normalizeMajors(raw).items[0] ?? null;
    });
    if (!value) throw new AppError(ErrorCode.CAREERNET_NOT_FOUND, '해당 학과 정보를 찾을 수 없어요.');
    return { data: this.majorToDto(value), meta: this.liveMeta(null, null) };
  }

  // ─── 학교 (EUC-KR XML) ───

  async listSchools(q: string | undefined, region: string | undefined, gubun: string | undefined, cursor: number | undefined, limit: number) {
    const dbCount = await this.prisma.school.count();
    if (dbCount > 0) {
      const where = {
        ...(q ? { name: { contains: q } } : {}),
        ...(region ? { region: { contains: region } } : {}),
        ...(gubun ? { gubun: { contains: gubun } } : {}),
      };
      const rows = await this.prisma.school.findMany({ where, orderBy: { seq: 'asc' }, skip: cursor ?? 0, take: limit + 1 });
      const page = rows.slice(0, limit);
      return {
        data: page.map((r) => ({ seq: r.seq, name: r.name, region: r.region, gubun: r.gubun, estType: r.estType, link: r.link })),
        meta: this.dbMeta(rows.length > limit ? (cursor ?? 0) + limit : null, await this.prisma.school.count({ where }), page[0]?.updatedAt ?? null),
      };
    }
    const { value } = await this.cache.getOrLoad(`career:schools:${q ?? ''}:${region ?? ''}:${gubun ?? ''}`, TTL.schools, async () => {
      const raw = await this.client.getXml('SCHOOL', { searchSchulNm: q, gubun: gubun ?? 'univ_list', region, thisPage: 1, perPage: 500 });
      return normalizeSchools(raw);
    });
    let items = value.items;
    if (q) items = items.filter((s) => s.name.includes(q));
    if (region) items = items.filter((s) => (s.region ?? '').includes(region));
    const start = cursor ?? 0;
    const page = items.slice(start, start + limit);
    return {
      data: page.map((s) => ({ seq: s.seq, name: s.name, region: s.region, gubun: s.gubun, estType: s.estType, link: s.link })),
      meta: this.liveMeta(start + limit < items.length ? start + limit : null, value.total ?? items.length),
    };
  }

  // ─── 상담사례 / 교육자료 (EUC-KR XML, live+캐시 전용 — 적재는 counsel만) ───

  async listCounselCases(q: string | undefined, cursor: number | undefined, limit: number) {
    const dbCount = await this.prisma.counselCase.count();
    if (dbCount > 0) {
      const where = { ...(q ? { title: { contains: q } } : {}), ...(cursor ? { seq: { gt: cursor } } : {}) };
      const rows = await this.prisma.counselCase.findMany({ where, orderBy: { seq: 'asc' }, take: limit + 1 });
      const page = rows.slice(0, limit);
      return {
        data: page.map((r) => ({ seq: r.seq, title: r.title, question: r.question, answer: r.answer })),
        meta: this.dbMeta(rows.length > limit ? (page[page.length - 1]?.seq ?? null) : null, dbCount, page[0]?.updatedAt ?? null),
      };
    }
    const { value } = await this.cache.getOrLoad(`career:counsel:${q ?? ''}`, TTL.counsel, async () => {
      const raw = await this.client.getXml('COUNSEL', { searchWord: q, thisPage: 1, perPage: 100 });
      return normalizeCounselCases(raw);
    });
    let items = value.items;
    if (q) items = items.filter((c) => c.title.includes(q) || (c.question ?? '').includes(q));
    if (cursor) items = items.filter((c) => c.seq > cursor);
    const page = items.slice(0, limit);
    return {
      data: page.map((c) => ({ seq: c.seq, title: c.title, question: c.question, answer: c.answer })),
      meta: this.liveMeta(items.length > limit ? (page[page.length - 1]?.seq ?? null) : null, value.total),
    };
  }

  async listEduMaterials(q: string | undefined, cursor: number | undefined, limit: number) {
    const { value } = await this.cache.getOrLoad(`career:cose:${q ?? ''}`, TTL.cose, async () => {
      const raw = await this.client.getXml('COSE', { searchWord: q, thisPage: 1, perPage: 100 });
      return normalizeEduMaterials(raw);
    });
    let items = value.items;
    if (q) items = items.filter((m) => m.title.includes(q));
    if (cursor) items = items.filter((m) => m.seq > cursor);
    const page = items.slice(0, limit);
    return {
      data: page.map((m) => ({ seq: m.seq, title: m.title, summary: m.summary, attFiles: m.attFiles })),
      meta: this.liveMeta(items.length > limit ? (page[page.length - 1]?.seq ?? null) : null, value.total),
    };
  }

  async listTests() {
    const { value } = await this.cache.getOrLoad('career:tests', TTL.tests, async () => {
      const raw = await this.client.getJson('/inspct/openapi/v2/tests');
      return normalizeTests(raw);
    });
    return { data: value, meta: this.liveMeta(null, value.length) };
  }

  // ─── DTO/meta 헬퍼 ───

  private jobToDto(j: NormalizedJob) {
    return {
      seq: j.seq,
      name: j.name,
      summary: j.summary,
      aptitude: j.aptitude,
      salary: j.salary,
      prospect: j.prospect,
      relatedMajors: j.relatedMajors,
      theme: j.theme,
    };
  }

  private jobRowToDto(r: { seq: number; name: string; summary: string | null; aptitude: string | null; salary: string | null; prospect: string | null; relatedMajors: string[]; theme: string | null }) {
    return {
      seq: r.seq,
      name: r.name,
      summary: r.summary,
      aptitude: r.aptitude,
      salary: r.salary,
      prospect: r.prospect,
      relatedMajors: r.relatedMajors,
      theme: r.theme,
    };
  }

  private majorToDto(m: NormalizedMajor) {
    return { majorSeq: m.majorSeq, name: m.name, field: m.field, summary: m.summary, departments: m.departments };
  }

  private majorRowToDto(r: { majorSeq: number; name: string; field: string | null; summary: string | null; departments: string[] }) {
    return { majorSeq: r.majorSeq, name: r.name, field: r.field, summary: r.summary, departments: r.departments };
  }

  private dbMeta(nextCursor: number | null, total: number | null, updatedAt: Date | null): ListMeta & { sourceLabel: string } {
    return { nextCursor, total, source: 'db', updatedAt: updatedAt ? updatedAt.toISOString() : null, sourceLabel: SOURCE_LABEL };
  }

  private liveMeta(nextCursor: number | null, total: number | null): ListMeta & { sourceLabel: string } {
    return { nextCursor, total, source: 'live', updatedAt: new Date().toISOString(), sourceLabel: SOURCE_LABEL };
  }
}
