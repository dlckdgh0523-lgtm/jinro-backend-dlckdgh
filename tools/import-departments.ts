import { createInterface } from 'node:readline';
import { createReadStream } from 'node:fs';
import iconv from 'iconv-lite';
import { PrismaClient } from '@prisma/client';
import { parseCsvLine, parseDeptRow, type DeptRow } from '../src/admissions/dept-csv';

// 대학별 학과정보 CSV 부트스트랩 임포터 (one-time / 연도별 재실행).
// 사용: DATABASE_URL=... npx tsx tools/import-departments.ts "<csv 경로>" [--active-only]
// 다음 년도부터는 같은 importer에 새 CSV(또는 학과정보 API 어댑터)를 물리면 됨.

async function main(): Promise<void> {
  const csvPath = process.argv[2];
  const activeOnly = process.argv.includes('--active-only');
  if (!csvPath) {
    console.error('usage: tsx tools/import-departments.ts <csv path> [--active-only]');
    process.exit(1);
  }

  const prisma = new PrismaClient();
  await prisma.$connect();

  // School 이름→seq 매핑(공시 학교명으로 FK 연결, 없으면 null)
  const schools = await prisma.school.findMany({ select: { seq: true, name: true } });
  const nameToSeq = new Map(schools.map((s) => [s.name, s.seq]));

  const rl = createInterface({ input: createReadStream(csvPath).pipe(iconv.decodeStream('euc-kr')), crlfDelay: Infinity });

  let header = true;
  let total = 0;
  let skipped = 0;
  let matched = 0;
  let batch: DeptRow[] = [];

  const flush = async (): Promise<void> => {
    if (!batch.length) return;
    const rows = batch;
    batch = [];
    await prisma.$transaction(
      rows.map((r) => {
        const schoolSeq = nameToSeq.get(r.schoolName) ?? null;
        if (schoolSeq) matched++;
        return prisma.universityDepartment.upsert({
          where: { schoolName_campus_name_svyYr: { schoolName: r.schoolName, campus: r.campus ?? '', name: r.name, svyYr: r.svyYr } },
          create: { ...r, campus: r.campus ?? '', schoolSeq },
          update: { ...r, campus: r.campus ?? '', schoolSeq },
        });
      }),
    );
  };

  for await (const line of rl) {
    if (header) {
      header = false;
      continue;
    }
    if (!line.trim()) continue;
    const row = parseDeptRow(parseCsvLine(line));
    if (!row) {
      skipped++;
      continue;
    }
    if (activeOnly && !row.active) continue;
    batch.push(row);
    total++;
    if (batch.length >= 500) {
      await flush();
      if (total % 5000 === 0) console.log(`...${total} rows`);
    }
  }
  await flush();
  await prisma.$disconnect();

  const distinctUnivs = new Set(schools.map((s) => s.name)).size;
  console.log(`done: imported ${total} departments (skipped ${skipped} malformed), FK-matched ${matched}, schools in DB ${distinctUnivs}`);
  process.exit(0);
}

void main().catch((e) => {
  console.error('import failed:', (e as Error).message);
  process.exit(1);
});
