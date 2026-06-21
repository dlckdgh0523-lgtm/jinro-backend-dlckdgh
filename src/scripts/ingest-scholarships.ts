// 장학금(한국장학재단) 1회 적재 — 큐(BullMQ) 우회, 직접 fetch + 전체 교체.
// 월간 갱신 때 KOSAF_SCHOLARSHIP_API_URL만 최신 uddi로 바꾸고 다시 실행하면 됨.
//
// 사용(운영):
//   docker compose -f docker-compose.prod.yml exec -T \
//     -e KOSAF_SCHOLARSHIP_API_URL="$KOSAF_SCHOLARSHIP_API_URL" \
//     api node dist/scripts/ingest-scholarships.js
import { PrismaClient, Prisma } from '@prisma/client';
import { ScholarshipClient } from '../admissions/scholarship.client';

async function main(): Promise<void> {
  const client = new ScholarshipClient();
  if (!client.enabled) {
    console.error('[scholarships] KOSAF_SCHOLARSHIP_API_URL 미설정 — 중단. (exec에 -e 로 넘겼는지 확인)');
    process.exit(1);
  }
  console.log('[scholarships] fetch 시작…');
  const rows = await client.fetchAll();
  console.log(`[scholarships] fetched: ${rows.length}건`);
  if (!rows.length) {
    console.error('[scholarships] 0건 — URL/serviceKey/네트워크 확인 필요. 적재 생략.');
    process.exit(2);
  }

  const prisma = new PrismaClient();
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
  const n = await prisma.scholarship.count();
  console.log(`[scholarships] ✅ 적재 완료: ${n}건`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('[scholarships] 실패:', (e as Error).message);
  process.exit(1);
});
