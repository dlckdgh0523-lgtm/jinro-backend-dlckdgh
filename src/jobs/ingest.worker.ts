import { Worker, type Job } from 'bullmq';
import type { PrismaClient, Prisma } from '@prisma/client';
import { CareernetClient } from '../career/careernet.client';
import {
  normalizeCounselCases,
  normalizeCounselDetail,
  normalizeJobsList,
  normalizeJuniorJobsList,
  normalizeMajors,
  normalizeSchools,
} from '../career/normalize';
import { AlimiClient } from '../admissions/alimi.client';
import { DeptApiClient } from '../admissions/dept-api.client';
import { IndustryClient } from '../admissions/industry.client';
import { OverseaUnivClient } from '../admissions/oversea-univ.client';
import { GgAdmissionClient } from '../admissions/gg-admission.client';
import { ScorecardClient } from '../admissions/scorecard.client';
import { EmploymentClient } from '../admissions/employment.client';
import { ExchangeClient } from '../admissions/exchange.client';
import { CoseClient } from '../career/cose.client';
import { Work24Client } from '../career/work24.client';
import { VmsClient } from '../volunteers/vms.client';
import { ScholarshipClient } from '../admissions/scholarship.client';
import { createBullRedis } from '../common/redis';
import { logger } from '../common/logger';
import { sentry } from '../common/sentry';
import { getQueues, QUEUE_NAMES } from './queues';

// 적재(ingestion) 워커 — cron으로 커리어넷 → 정규화 → PostgreSQL upsert.
// 런타임이 커리어넷에 직접 의존하지 않게 하는 핵심. 적재 후 embed 잡 enqueue.

export function startIngestWorker(prisma: PrismaClient): Worker {
  const client = new CareernetClient();

  async function run(source: string, fn: () => Promise<number>): Promise<number> {
    const runRow = await prisma.ingestionRun.create({ data: { source, status: 'running' } });
    try {
      const count = await fn();
      await prisma.ingestionRun.update({ where: { id: runRow.id }, data: { status: 'done', count, finishedAt: new Date() } });
      logger.info({ source, count }, 'ingestion done');
      return count;
    } catch (e) {
      await prisma.ingestionRun.update({
        where: { id: runRow.id },
        data: { status: 'failed', error: (e as Error).message.slice(0, 500), finishedAt: new Date() },
      });
      logger.error({ source, err: (e as Error).message }, 'ingestion failed');
      throw e;
    }
  }

  const worker = new Worker(
    QUEUE_NAMES.ingest,
    async (job: Job) => {
      const results: Record<string, number | string> = {};
      // 적재 범위(스코프) — 사용자 요청: 학과정보는 월간, 봉사·취업률 등은 일간.
      // scope: 'daily' | 'monthly' | 'full' | undefined(=full)
      const scope = (job.data as { scope?: string } | undefined)?.scope ?? 'full';
      const runDaily = scope === 'daily' || scope === 'full';
      const runMonthly = scope === 'monthly' || scope === 'full';
      logger.info({ scope, jobId: job.id }, 'ingest starting');

      // 실 API는 페이지 크기 10 고정 (pageSize/pageUnit 무시 — 2026-06 검증) → pageIndex 루프
      async function fetchAllPages(path: string, extra: Record<string, string | number> = {}): Promise<unknown[]> {
        const pages: unknown[] = [];
        let total = Infinity;
        let collected = 0;
        for (let pageIndex = 1; pageIndex <= 200 && collected < total; pageIndex++) {
          const raw = await client.getJson(path, { ...extra, pageIndex });
          const page = normalizeJobsList(raw); // count/배열 추출용 — junior도 count/jobs 구조 동일
          const rawItems = ((raw as Record<string, unknown>)['jobs'] ?? []) as unknown[];
          if (!Array.isArray(rawItems) || rawItems.length === 0) break;
          pages.push(raw);
          collected += rawItems.length;
          total = page.total ?? collected;
          await new Promise((r) => setTimeout(r, 30)); // 페이싱
        }
        return pages;
      }

      // 소스별 독립 실패 허용 — 한 소스가 죽어도 나머지는 적재
      try {
        results['jobs'] = await run('jobs', async () => {
          const rawPages = await fetchAllPages('/cnet/front/openapi/jobs.json');
          const items = rawPages.flatMap((raw) => normalizeJobsList(raw).items);
          for (const j of items) {
            await prisma.careerJob.upsert({
              where: { seq: j.seq },
              create: {
                seq: j.seq, name: j.name, summary: j.summary, aptitude: j.aptitude, salary: j.salary,
                prospect: j.prospect, relatedMajors: j.relatedMajors, theme: j.theme, raw: j.raw as Prisma.InputJsonValue,
              },
              update: {
                name: j.name, summary: j.summary, aptitude: j.aptitude, salary: j.salary,
                prospect: j.prospect, relatedMajors: j.relatedMajors, theme: j.theme, raw: j.raw as Prisma.InputJsonValue,
              },
            });
          }
          return items.length;
        });
      } catch (e) {
        results['jobs'] = `failed: ${(e as Error).message}`;
      }

      try {
        results['juniorJobs'] = await run('juniorJobs', async () => {
          const rawPages = await fetchAllPages('/cnet/front/openapi/juniorjobsinfo.json');
          const items = rawPages.flatMap((raw) => normalizeJuniorJobsList(raw).items);
          for (const j of items) {
            await prisma.juniorJob.upsert({
              where: { seq: j.seq },
              create: { seq: j.seq, name: j.name, field: j.field, summary: j.summary, raw: j.raw as Prisma.InputJsonValue },
              update: { name: j.name, field: j.field, summary: j.summary, raw: j.raw as Prisma.InputJsonValue },
            });
          }
          return items.length;
        });
      } catch (e) {
        results['juniorJobs'] = `failed: ${(e as Error).message}`;
      }

      try {
        results['majors'] = await run('majors', async () => {
          const raw = await client.getXml('MAJOR', { gubun: 'univ_list', thisPage: 1, perPage: 1000 });
          const { items } = normalizeMajors(raw);
          for (const m of items) {
            await prisma.major.upsert({
              where: { majorSeq: m.majorSeq },
              create: { majorSeq: m.majorSeq, name: m.name, field: m.field, summary: m.summary, departments: m.departments, raw: m.raw as Prisma.InputJsonValue },
              update: { name: m.name, field: m.field, summary: m.summary, departments: m.departments, raw: m.raw as Prisma.InputJsonValue },
            });
          }
          return items.length;
        });
      } catch (e) {
        results['majors'] = `failed: ${(e as Error).message}`;
      }

      try {
        results['schools'] = await run('schools', async () => {
          const raw = await client.getXml('SCHOOL', { gubun: 'univ_list', thisPage: 1, perPage: 1000 });
          const { items } = normalizeSchools(raw);
          for (const s of items) {
            await prisma.school.upsert({
              where: { seq: s.seq },
              create: { seq: s.seq, name: s.name, region: s.region, gubun: s.gubun, estType: s.estType, link: s.link, raw: s.raw as Prisma.InputJsonValue },
              update: { name: s.name, region: s.region, gubun: s.gubun, estType: s.estType, link: s.link, raw: s.raw as Prisma.InputJsonValue },
            });
          }
          return items.length;
        });
      } catch (e) {
        results['schools'] = `failed: ${(e as Error).message}`;
      }

      try {
        results['counsel'] = await run('counsel', async () => {
          // 실 API: COUNSEL 목록 = 질문 코드표 → 항목별 COUNSEL_VIEW?con_cd=로 본문 수집 (50ms 페이싱)
          const raw = await client.getXml('COUNSEL', { thisPage: 1, perPage: 500 });
          const { items } = normalizeCounselCases(raw);
          let saved = 0;
          for (const c of items) {
            let question = c.question;
            let answer = c.answer;
            const code = (c.raw['code'] ?? c.raw['con_cd']) as string | undefined;
            const gubun = c.raw['gubun'] as string | undefined;
            if (!answer && code && gubun) {
              try {
                // 실 API: COUNSEL_VIEW는 gubun(분류) + con_cd(질문코드) 둘 다 필수
                const detail = normalizeCounselDetail(await client.getXml('COUNSEL_VIEW', { con_cd: code, gubun }));
                question = detail?.question ?? question;
                answer = detail?.answer ?? answer;
                await new Promise((r) => setTimeout(r, 50));
              } catch (e) {
                logger.warn({ code, err: (e as Error).message }, 'counsel detail fetch failed — title only');
              }
            }
            await prisma.counselCase.upsert({
              where: { seq: c.seq },
              create: { seq: c.seq, title: c.title, question, answer, raw: c.raw as Prisma.InputJsonValue },
              update: { title: c.title, question, answer, raw: c.raw as Prisma.InputJsonValue },
            });
            saved += 1;
          }
          return saved;
        });
      } catch (e) {
        results['counsel'] = `failed: ${(e as Error).message}`;
      }

      // 대학알리미 공시정보로 학교 데이터 보강 (DATA_GO_KR_API_KEY 있을 때만)
      const alimi = new AlimiClient();
      if (alimi.enabled) {
        try {
          results['alimi'] = await run('alimi', async () => {
            const year = (await alimi.latestPubYear()) ?? new Date().getFullYear();
            const univs = await alimi.listUniversities(year);
            // 표기 차이로 매칭 실패하던 대학들(약 152교) 보강 — School.name과 alimi name이 다르면
            // 변형(국립 prefix 제거/추가, 공백 제거, "대학교"/"대학" 토글)로 한 번 더 시도.
            const allSchools = await prisma.school.findMany({ select: { seq: true, name: true } });
            const normNorm = (s: string) => s.replace(/^(국립|공립|사립)/, '').replace(/\s+/g, '').trim();
            const nameIndex = new Map<string, { seq: string; name: string }[]>();
            for (const s of allSchools) {
              const k = normNorm(s.name);
              const arr = nameIndex.get(k) ?? []; arr.push(s); nameIndex.set(k, arr);
            }
            let enriched = 0;
            for (const u of univs) {
              // 본교 항목 우선 — 같은 이름의 캠퍼스 항목이 본교를 덮어쓰지 않게
              let school = await prisma.school.findFirst({ where: { name: u.name } });
              if (!school) {
                // 표기 변형 매칭: 정규화 후 동일하면 첫 후보 사용
                const candidates = nameIndex.get(normNorm(u.name)) ?? [];
                if (candidates.length > 0) {
                  const found = await prisma.school.findUnique({ where: { seq: candidates[0]!.seq } });
                  if (found) school = found;
                }
              }
              if (!school) continue;
              const prevAlimi = (school.raw as Record<string, unknown>)?.['alimi'] as Record<string, unknown> | undefined;
              if (prevAlimi && prevAlimi['clgcpDivNm'] === '본교' && u.campus !== '본교') continue;

              // 입시 핵심 지표(경쟁률·충원율·등록률) — 직전 공시연도(당해는 미공시일 수 있음) 우선
              let admissions: Record<string, unknown> | undefined;
              for (const statYr of [year - 1, year]) {
                const s = await alimi.universityAdmissionStats(statYr, u.schlId);
                if (s.competitionRate !== null || s.freshmanFillRate !== null || s.finalRegistrationRate !== null) {
                  admissions = { ...s, svyYr: statYr, source: '대학알리미 대학정보공시', confidence: 'confirmed' };
                  break;
                }
              }
              await prisma.school.update({
                where: { seq: school.seq },
                data: {
                  estType: u.estType ?? school.estType,
                  raw: { ...(school.raw as object), alimi: u.raw, ...(admissions ? { admissions } : {}) } as Prisma.InputJsonValue,
                },
              });
              enriched += 1;
              await new Promise((r) => setTimeout(r, 30)); // 일일 트래픽(1000/op) 보호 페이싱
            }
            logger.info({ year, total: univs.length, enriched }, 'alimi enrichment');
            return enriched;
          });
        } catch (e) {
          results['alimi'] = `failed: ${(e as Error).message}`;
        }
      } else {
        results['alimi'] = 'skipped (no DATA_GO_KR_API_KEY)';
      }

      // 대학별 학과 (PRIMARY) — 대학알리미 학과정보 API (B340014/BasicInformationService_1, schlId+svyYr).
      // 2026-06 검증: 전국 320교(schlId 보유) × 평균 100여 학과 = ~34,000건. svyYr=2025 최신.
      // schlId 누락 학교는 이 단계 앞에서 alimi 단계가 listUniversities로 채워둠.
      if (alimi.enabled) {
        try {
          results['departments_alimi'] = await run('departments_alimi', async () => {
            const svyYr = 2025; // alimi 학과 API 최신 공시연도. 필요 시 latestPubYear로 동기화 가능.
            const schools = await prisma.school.findMany({ select: { seq: true, name: true, raw: true } });
            const targets = schools
              .map((s) => ({ seq: s.seq, name: s.name, schlId: ((s.raw as Record<string, unknown> | null)?.['alimi'] as Record<string, unknown> | undefined)?.['schlId'] as string | undefined }))
              .filter((s): s is { seq: string; name: string; schlId: string } => !!s.schlId);
            let majors = 0;
            for (const t of targets) {
              try {
                const rows = await alimi.listMajorsBySchool(t.schlId, svyYr);
                for (const r of rows) {
                  await prisma.universityDepartment.upsert({
                    where: { schoolName_campus_name_svyYr: { schoolName: r.schoolName, campus: r.campus ?? '', name: r.name, svyYr: r.svyYr } },
                    create: {
                      svyYr: r.svyYr, schoolName: r.schoolName, campus: r.campus ?? '', name: r.name,
                      college: r.college, dayNight: r.dayNight, feature: r.feature,
                      status: r.status, active: r.active,
                      seriesLarge: r.seriesLarge, seriesMid: r.seriesMid, seriesSmall: r.seriesSmall,
                      degree: r.degree, years: r.years,
                      schoolSeq: t.seq, source: '대학알리미 학과정보(B340014)',
                    },
                    update: {
                      svyYr: r.svyYr, schoolName: r.schoolName, campus: r.campus ?? '', name: r.name,
                      college: r.college, dayNight: r.dayNight, feature: r.feature,
                      status: r.status, active: r.active,
                      seriesLarge: r.seriesLarge, seriesMid: r.seriesMid, seriesSmall: r.seriesSmall,
                      degree: r.degree, years: r.years,
                      schoolSeq: t.seq, source: '대학알리미 학과정보(B340014)',
                    },
                  });
                  majors += 1;
                }
              } catch (e) {
                logger.warn({ schlId: t.schlId, name: t.name, err: (e as Error).message }, 'alimi majors fetch failed');
              }
              await new Promise((r) => setTimeout(r, 20));
            }
            logger.info({ svyYr, schools: targets.length, majors }, 'alimi majors refresh');
            return majors;
          });
        } catch (e) {
          results['departments_alimi'] = `failed: ${(e as Error).message}`;
        }
      }

      // 대학별 학과 (LEGACY) — 경기데이터드림 API. 2023 기준이라 대학알리미 단계가 우선이고, 이건 fallback.
      // monthly에만 돌고, alimi가 못 채운 대학을 메우는 용도(같은 unique key라 alimi 데이터를 덮어쓰진 않음 — 동일 학과면 source만 바뀜).
      const deptApi = new DeptApiClient();
      // 학과 정보는 거의 안 바뀜 — monthly만 실행 (사용자 요청)
      if (deptApi.enabled && runMonthly) {
        try {
          results['departments'] = await run('departments', async () => {
            const { rows, svyYr } = await deptApi.fetchAll({ onlyLatestYear: true });
            if (!rows.length || svyYr === null) return 0;
            const schools = await prisma.school.findMany({ select: { seq: true, name: true } });
            const nameToSeq = new Map(schools.map((s) => [s.name, s.seq]));
            let saved = 0;
            for (const r of rows) {
              await prisma.universityDepartment.upsert({
                where: { schoolName_campus_name_svyYr: { schoolName: r.schoolName, campus: r.campus ?? '', name: r.name, svyYr: r.svyYr } },
                create: { ...r, campus: r.campus ?? '', schoolSeq: nameToSeq.get(r.schoolName) ?? null, source: '대학알리미(경기데이터드림 API)' },
                update: { ...r, campus: r.campus ?? '', schoolSeq: nameToSeq.get(r.schoolName) ?? null, source: '대학알리미(경기데이터드림 API)' },
              });
              saved += 1;
            }
            logger.info({ svyYr, saved }, 'department api refresh');
            return saved;
          });
        } catch (e) {
          results['departments'] = `failed: ${(e as Error).message}`;
        }
      } else {
        results['departments'] = 'skipped (no GG_DATA_API_KEY — CSV importer 데이터 사용)';
      }

      // ── 진로교육자료(COSE) — 학년별 자료 (RAG·"다음 실천"에서 활용) ──
      try {
        results['cose'] = await run('cose', async () => {
          const cose = new CoseClient();
          let saved = 0;
          for (let page = 1; page <= 30; page++) {
            const { items } = await cose.list({ thisPage: page, perPage: 100 });
            if (!items.length) break;
            for (const it of items) {
              await prisma.careerEducationMaterial.upsert({
                where: { seq: it.seq },
                create: { ...it, raw: it.raw as Prisma.InputJsonValue },
                update: { ...it, raw: it.raw as Prisma.InputJsonValue },
              });
              saved += 1;
            }
            await new Promise((r) => setTimeout(r, 80));
          }
          return saved;
        });
      } catch (e) {
        results['cose'] = `failed: ${(e as Error).message}`;
      }

      // ── 해외대학 표준국문명칭 — 외국학교 기반 ──
      const oversea = new OverseaUnivClient();
      if (oversea.enabled) {
        try {
          results['oversea_univ'] = await run('oversea_univ', async () => {
            const items = await oversea.fetchAll({ maxPages: 50 });
            for (const u of items) {
              await prisma.foreignUniversity.upsert({
                where: { id: u.id },
                create: { ...u, raw: u.raw as Prisma.InputJsonValue },
                update: { ...u, raw: u.raw as Prisma.InputJsonValue },
              });
            }
            return items.length;
          });
        } catch (e) {
          results['oversea_univ'] = `failed: ${(e as Error).message}`;
        }
      } else {
        results['oversea_univ'] = 'skipped (no DATA_GO_KR_API_KEY)';
      }

      // ── 봉사활동(VMS) — 봉사처 + 모집정보(strDate/endDate, areaCode 필수 — 지역 17개 순회)
      const vms = new VmsClient();
      // VMS 모집 지역코드: 0101~0117 (17개 시도). 실측 확인 — 0101=서울 등, 0118+는 빈값.
      const VMS_AREAS = ['0101','0102','0103','0104','0105','0106','0107','0108','0109','0110','0111','0112','0113','0114','0115','0116','0117'];
      if (vms.enabled) {
        try {
          results['volunteer_recruits'] = await run('volunteer_recruits', async () => {
            let saved = 0;
            for (const areaCode of VMS_AREAS) {
              try {
                for (let page = 1; page <= 3; page++) {
                  const { items } = await vms.listRecruits({ pageNo: page, numOfRows: 100, areaCode });
                  if (!items.length) break;
                  for (const v of items) {
                    // 모집중만 적재 (모집완료 제외) — raw.statusName으로 판별
                    const status = String((v.raw as Record<string, unknown>)['statusName'] ?? '');
                    if (status && status !== '모집중') continue;
                    await prisma.volunteerOpportunity.upsert({
                      where: { externalId: v.externalId },
                      create: { ...v, raw: v.raw as Prisma.InputJsonValue },
                      update: { ...v, raw: v.raw as Prisma.InputJsonValue },
                    });
                    saved += 1;
                  }
                  await new Promise((r) => setTimeout(r, 60));
                }
              } catch { /* area skipped */ }
            }
            return saved;
          });
        } catch (e) {
          results['volunteer_recruits'] = `failed: ${(e as Error).message}`;
        }
      }
      // 봉사처(센터) 적재는 모집공고가 하나도 없을 때만 — 모집공고가 더 풍부(장소·활동유형·모집인원).
      const recruitsOk = typeof results['volunteer_recruits'] === 'number' && (results['volunteer_recruits'] as number) > 0;
      if (vms.enabled && !recruitsOk) {
        try {
          results['volunteers'] = await run('volunteers', async () => {
            let saved = 0;
            for (let page = 1; page <= 10; page++) {
              const { items, total } = await vms.listCenters(page, 100);
              if (!items.length) break;
              for (const c of items) {
                await prisma.volunteerOpportunity.upsert({
                  where: { externalId: `center-${c.centCode}` },
                  create: {
                    externalId: `center-${c.centCode}`,
                    source: 'VMS-center',
                    title: `${c.centName}${c.centTypeName ? ` (${c.centTypeName})` : ''} — 봉사 기회 안내`,
                    centerName: c.centName,
                    centerType: c.centTypeName,
                    region: c.areaName,
                    address: c.address,
                    contact: c.contact,
                    youthEligible: true,
                    raw: c as unknown as Prisma.InputJsonValue,
                  },
                  update: {
                    centerName: c.centName,
                    centerType: c.centTypeName,
                    region: c.areaName,
                    address: c.address,
                    contact: c.contact,
                    raw: c as unknown as Prisma.InputJsonValue,
                  },
                });
                saved += 1;
              }
              if (page * 100 >= total) break;
              await new Promise((r) => setTimeout(r, 60));
            }
            return saved;
          });
        } catch (e) {
          results['volunteers'] = `failed: ${(e as Error).message}`;
        }
      } else {
        results['volunteers'] = 'skipped (no DATA_GO_KR_API_KEY)';
      }

      // ── 장학금 (한국장학재단 학자금지원정보, odcloud) — 전체 교체(deleteMany + createMany)
      const scholarshipClient = new ScholarshipClient();
      if (scholarshipClient.enabled) {
        try {
          results['scholarships'] = await run('scholarships', async () => {
            const rows = await scholarshipClient.fetchAll();
            if (!rows.length) return 0;
            await prisma.$transaction([
              prisma.scholarship.deleteMany({}),
              prisma.scholarship.createMany({
                data: rows.map((s) => ({
                  source: '한국장학재단',
                  organization: s.organization,
                  productName: s.productName,
                  productType: s.productType,
                  supportType: s.supportType,
                  target: s.target,
                  applyPeriod: s.applyPeriod,
                  amount: s.amount,
                  selectCount: s.selectCount,
                  rawData: s.raw as Prisma.InputJsonValue,
                })),
              }),
            ]);
            return rows.length;
          });
        } catch (e) {
          results['scholarships'] = `failed: ${(e as Error).message}`;
        }
      } else {
        results['scholarships'] = 'skipped (no KOSAF_SCHOLARSHIP_API_URL)';
      }

      // ── 산학협력(현장실습/캡스톤 등) + 경기 신입생충원 — School.raw에 병합 ──
      const industry = new IndustryClient();
      const gg = new GgAdmissionClient();
      if (industry.enabled || gg.enabled) {
        try {
          results['industry_freshman'] = await run('industry_freshman', async () => {
            let enriched = 0;
            const freshman = gg.enabled ? await gg.fetchFreshmanFill() : [];
            const fmap = new Map<string, typeof freshman[number]>();
            // 최신 연도 우선 매핑
            for (const f of freshman.sort((a, b) => b.svyYr - a.svyYr)) {
              if (!fmap.has(f.schoolName)) fmap.set(f.schoolName, f);
            }
            // Prisma JSON path 필터는 까다로워서 모든 학교를 가져온 뒤 코드에서 alimi.schlId 보유 학교만 처리
            const schools = await prisma.school.findMany({ take: 500 });
            for (const s of schools) {
              const alimi = (s.raw as Record<string, unknown> | null)?.['alimi'] as Record<string, unknown> | undefined;
              const schlId = String(alimi?.['schlId'] ?? '');
              const patch: Record<string, unknown> = {};
              if (industry.enabled && schlId) {
                const sum = await industry.universitySummary(2024, schlId);
                if (Object.values(sum).some((v) => v > 0)) patch['industry'] = { ...sum, svyYr: 2024, source: '대학알리미 산학협력', confidence: 'confirmed' };
              }
              const ff = fmap.get(s.name);
              if (ff) {
                patch['freshman'] = {
                  svyYr: ff.svyYr,
                  capacity: ff.capacity,
                  applicants: ff.applicants,
                  enrolled: ff.enrolled,
                  fillRate: ff.fillRate,
                  competition: ff.competition,
                  source: '경기데이터드림 신입생충원',
                  confidence: 'confirmed',
                };
              }
              if (Object.keys(patch).length) {
                await prisma.school.update({
                  where: { seq: s.seq },
                  data: { raw: { ...(s.raw as object), ...patch } as Prisma.InputJsonValue },
                });
                enriched += 1;
              }
              if (industry.enabled && schlId) await new Promise((r) => setTimeout(r, 25));
            }
            return enriched;
          });
        } catch (e) {
          results['industry_freshman'] = `failed: ${(e as Error).message}`;
        }
      } else {
        results['industry_freshman'] = 'skipped';
      }

      // ── College Scorecard — 미국 대학 학비/입학률/졸업률/중위소득 ──
      const scorecard = new ScorecardClient();
      if (scorecard.enabled) {
        try {
          results['scorecard_us'] = await run('scorecard_us', async () => {
            const items = await scorecard.fetchAll(20); // 100건/페이지 × 20 = 최대 2,000개
            let updated = 0;
            for (const s of items) {
              // ForeignUniversity와 영문명 정확 매칭 또는 새 레코드 생성
              // KF에 있는 대학은 영문명으로 갱신, 없는 대학은 새로 추가
              const existing = await prisma.foreignUniversity.findFirst({ where: { nameEn: s.name, countryIso2: 'US' } });
              const data = {
                scorecardId: s.id,
                city: s.city,
                state: s.state,
                admissionRate: s.admissionRate,
                studentSize: s.studentSize,
                tuitionInState: s.tuitionInState,
                tuitionOutState: s.tuitionOutState,
                medianEarnings: s.medianEarnings,
                completionRate: s.completionRate,
              };
              if (existing) {
                await prisma.foreignUniversity.update({ where: { id: existing.id }, data });
                updated += 1;
              } else {
                // KF에 없는 미국 대학은 새로 추가 (id는 scorecard ID 기반)
                await prisma.foreignUniversity.upsert({
                  where: { id: `US-SC-${s.id}` },
                  create: {
                    id: `US-SC-${s.id}`,
                    nameKo: s.name, // KF 한글명 없으면 영문명을 임시로 (차후 보정)
                    nameEn: s.name,
                    countryKo: '미국',
                    countryEn: 'United States',
                    countryIso2: 'US',
                    raw: s.raw as Prisma.InputJsonValue,
                    ...data,
                  },
                  update: { ...data, raw: s.raw as Prisma.InputJsonValue },
                });
                updated += 1;
              }
            }
            return updated;
          });
        } catch (e) {
          results['scorecard_us'] = `failed: ${(e as Error).message}`;
        }
      } else {
        results['scorecard_us'] = 'skipped (no SCORECARD_API_KEY)';
      }

      // ── 졸업생 취업률 (경기데이터드림 Grduemplymtuniv) ──
      const employment = new EmploymentClient();
      if (employment.enabled) {
        try {
          results['employment'] = await run('employment', async () => {
            const rows = await employment.fetchAll(20);
            let saved = 0;
            for (const r of rows) {
              await prisma.universityEmploymentStat.upsert({
                where: { schoolName_majorName_svyYr: { schoolName: r.schoolName, majorName: r.majorName ?? '', svyYr: r.svyYr } },
                create: { ...r, majorName: r.majorName ?? '', rawData: r as unknown as Prisma.InputJsonValue },
                update: { ...r, majorName: r.majorName ?? '', rawData: r as unknown as Prisma.InputJsonValue },
              });
              saved += 1;
            }
            return saved;
          });
        } catch (e) {
          results['employment'] = `failed: ${(e as Error).message}`;
        }
      }

      // ── 외국대학 교류 (경기데이터드림 Fgcutunivstus) ──
      const exchange = new ExchangeClient();
      if (exchange.enabled) {
        try {
          results['exchange'] = await run('exchange', async () => {
            const rows = await exchange.fetchAll(5);
            let saved = 0;
            for (const r of rows) {
              await prisma.universityExchangeStat.upsert({
                where: { schoolName_svyYr: { schoolName: r.schoolName, svyYr: r.svyYr } },
                create: { ...r, rawData: r as unknown as Prisma.InputJsonValue },
                update: { ...r, rawData: r as unknown as Prisma.InputJsonValue },
              });
              saved += 1;
            }
            return saved;
          });
        } catch (e) {
          results['exchange'] = `failed: ${(e as Error).message}`;
        }
      }

      // ── 봉사 만료 정리 — 모집 마감일(recruitTo)이 지난 항목 자동 삭제 ──
      // 사용자 요구: "기간이 지난건 지우고 새로운건 받아오고". 매일 적재 잡에서 실행.
      try {
        const expired = await prisma.volunteerOpportunity.deleteMany({
          where: { recruitTo: { not: null, lt: new Date() } },
        });
        results['volunteers_cleanup'] = `expired removed: ${expired.count}`;
      } catch (e) {
        results['volunteers_cleanup'] = `failed: ${(e as Error).message}`;
      }

      // ── work24 4종 (커리어넷 보완: NCS·직종코드 백과) ──
      const w24 = new Work24Client();
      try {
        const jobs = await w24.searchJobs({}); // 전체 직업 482건
        results['work24_jobs'] = `fetched ${jobs.length}`;
      } catch {
        results['work24_jobs'] = 'failed';
      }

      // 임베딩 잡 enqueue (멱등 jobId — 분 단위 dedupe)
      await getQueues().embed.add('all', {}, { jobId: `embed-${Math.floor(Date.now() / 60_000)}` });
      return results;
    },
    { connection: createBullRedis(), concurrency: 1 },
  );

  worker.on('failed', (job, err) => {
    logger.error({ jobId: job?.id, err: err.message }, 'ingest job failed');
    if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
      sentry().captureException(err, { jobId: job.id, queue: 'ingest' });
      void getQueues().dlq.add('ingest-failed', { error: err.message, failedAt: new Date().toISOString() });
    }
  });

  return worker;
}
