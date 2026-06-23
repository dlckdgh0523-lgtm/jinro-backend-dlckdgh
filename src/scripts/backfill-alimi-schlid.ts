// schlId 누락 대학 보강 + 대학알리미 학과 일괄 적재 (일회성).
// 정식 코드(ingest.worker)가 매일 04:00에 동일 작업을 자동 수행하지만, 그 cron을 기다리지 않고
// 지금 즉시 채우고 싶을 때 직접 호출. 이름 변형 매칭(국립 prefix/공백 제거 정규화)으로
// "School.name"과 alimi 대학목록의 표기 차이를 흡수해 schlId를 채운 뒤, 학과 API로 학과를 채운다.
//
// 사용:
//   docker exec jinro-backend-dlckdgh-api-1 node dist/scripts/backfill-alimi-schlid.js
import { PrismaClient, Prisma } from '@prisma/client';
import { AlimiClient } from '../admissions/alimi.client';

function normNorm(s: string): string {
  return s.replace(/^(국립|공립|사립)/, '').replace(/\s+/g, '').trim();
}

async function main(): Promise<void> {
  const alimi = new AlimiClient();
  if (!alimi.enabled) { console.error('[backfill] DATA_GO_KR_API_KEY 미설정 — 중단'); process.exit(1); }
  const prisma = new PrismaClient();

  // 1) schlId 보강 — School.name 변형으로 alimi 대학목록과 매칭
  const year = (await alimi.latestPubYear()) ?? new Date().getFullYear();
  const univs = await alimi.listUniversities(year);
  console.log(`[backfill] alimi 대학목록: ${univs.length}교 (svyYr=${year})`);

  const allSchools = await prisma.school.findMany({ select: { seq: true, name: true, raw: true } });
  const nameIndex = new Map<string, { seq: string; name: string; raw: unknown }[]>();
  for (const s of allSchools) {
    const k = normNorm(s.name);
    const arr = nameIndex.get(k) ?? []; arr.push(s); nameIndex.set(k, arr);
  }
  let enriched = 0;
  for (const u of univs) {
    const candidates = nameIndex.get(normNorm(u.name)) ?? [];
    for (const c of candidates) {
      const prev = (c.raw as Record<string, unknown> | null)?.['alimi'] as Record<string, unknown> | undefined;
      if (prev && prev['schlId']) continue; // 이미 있음 → skip
      await prisma.school.update({
        where: { seq: c.seq },
        data: { raw: { ...((c.raw as object) ?? {}), alimi: u.raw } as Prisma.InputJsonValue },
      });
      enriched += 1;
    }
  }
  console.log(`[backfill] schlId 보강: ${enriched}교`);

  // 2) 학과 적재 (schlId 보유 대학 전체 순회)
  const refreshed = await prisma.school.findMany({ select: { seq: true, name: true, raw: true } });
  const targets = refreshed
    .map((s) => ({ seq: s.seq, name: s.name, schlId: ((s.raw as Record<string, unknown> | null)?.['alimi'] as Record<string, unknown> | undefined)?.['schlId'] as string | undefined }))
    .filter((t): t is { seq: string; name: string; schlId: string } => !!t.schlId);
  console.log(`[backfill] schlId 보유 대학: ${targets.length}교 → 학과 적재 시작`);

  const svyYr = 2025;
  let majors = 0, done = 0;
  for (const t of targets) {
    try {
      const rows = await alimi.listMajorsBySchool(t.schlId, svyYr);
      for (const r of rows) {
        const data = {
          svyYr: r.svyYr, schoolName: r.schoolName, campus: r.campus ?? '', name: r.name,
          college: r.college, dayNight: r.dayNight, feature: r.feature,
          status: r.status, active: r.active,
          seriesLarge: r.seriesLarge, seriesMid: r.seriesMid, seriesSmall: r.seriesSmall,
          degree: r.degree, years: r.years,
          schoolSeq: t.seq, source: '대학알리미 학과정보(B340014)',
        };
        await prisma.universityDepartment.upsert({
          where: { schoolName_campus_name_svyYr: { schoolName: r.schoolName, campus: r.campus ?? '', name: r.name, svyYr: r.svyYr } },
          create: data, update: data,
        });
        majors += 1;
      }
    } catch (e) {
      console.warn(`[backfill] ${t.name} (${t.schlId}) 실패:`, (e as Error).message);
    }
    if (++done % 40 === 0) console.log(`[backfill] ${done}/${targets.length} 대학, 학과 ${majors}건`);
    await new Promise((r) => setTimeout(r, 20));
  }

  const linked = await prisma.universityDepartment.findMany({ where: { NOT: { schoolSeq: null } }, distinct: ['schoolSeq'], select: { schoolSeq: true } });
  console.log(`[backfill] ✅ 완료: ${targets.length}교 처리, 학과 ${majors}건. FK 연결 대학 ${linked.length}교`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error('[backfill] 실패:', (e as Error).message); process.exit(1); });
