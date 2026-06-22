// 학과(대학별 학과정보) 1회 직접 적재 — 큐(BullMQ) 우회. 경기데이터드림 DeptApiClient 사용.
// ingest-boot 잡 ID가 하루 1회만 도는 문제 회피 + 즉시 결과 출력(진단 겸용).
//
// 사용(운영):
//   docker compose -f docker-compose.prod.yml exec -T \
//     -e GG_DATA_API_KEY="<경기데이터드림 키>" \
//     api node dist/scripts/ingest-departments.js
import { PrismaClient } from '@prisma/client';
import { DeptApiClient } from '../admissions/dept-api.client';

async function main(): Promise<void> {
  const deptApi = new DeptApiClient();
  if (!deptApi.enabled) {
    console.error('[departments] GG_DATA_API_KEY 미설정 — 중단. (exec에 -e GG_DATA_API_KEY 넘겼는지 확인)');
    process.exit(1);
  }
  console.log('[departments] fetch 시작…');
  const { rows, svyYr } = await deptApi.fetchAll({ onlyLatestYear: true });
  console.log(`[departments] fetched: ${rows.length}건 (기준연도 ${svyYr})`);
  if (!rows.length || svyYr === null) {
    console.error('[departments] 0건 — 키/네트워크/응답 확인 필요(gg.go.kr은 한국 IP만 허용). 중단.');
    process.exit(2);
  }

  const prisma = new PrismaClient();
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
    if (saved % 500 === 0) console.log(`[departments] ${saved}/${rows.length}`);
  }
  const n = await prisma.universityDepartment.count();
  console.log(`[departments] ✅ 적재 완료: ${n}건`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('[departments] 실패:', (e as Error).message);
  process.exit(1);
});
