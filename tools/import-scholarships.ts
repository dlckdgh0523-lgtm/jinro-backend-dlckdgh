import { createInterface } from 'node:readline';
import { createReadStream } from 'node:fs';
import iconv from 'iconv-lite';
import { PrismaClient } from '@prisma/client';

// 한국장학재단 학자금지원정보(대학생) CSV importer (EUC-KR).
// 컬럼: 번호,운영기관명,상품명,운영기관구분,상품구분,학자금유형구분,대학구분,학년구분,학과구분,
//       성적기준 상세내용,소득기준 상세내용,지원내역 상세내용,특정자격 상세내용,
//       지역거주여부 상세내용,선발방법 상세내용,선발인원 상세내용,자격제한 상세내용,
//       추천필요여부 상세내용,제출서류 상세내용,홈페이지 주소,모집시작일,모집종료일

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = false;
      } else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

async function main(): Promise<void> {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error('usage: tsx tools/import-scholarships.ts <csv path>');
    process.exit(1);
  }
  const prisma = new PrismaClient();
  await prisma.$connect();

  const rl = createInterface({
    input: createReadStream(csvPath).pipe(iconv.decodeStream('euc-kr')),
    crlfDelay: Infinity,
  });

  let header = true;
  let saved = 0;
  for await (const line of rl) {
    if (header) { header = false; continue; }
    if (!line.trim()) continue;
    const f = parseCsvLine(line);
    if (f.length < 12) continue;
    const productName = (f[2] ?? '').trim();
    if (!productName) continue;
    await prisma.scholarship.create({
      data: {
        organization: (f[1] ?? '').trim() || null,
        productName,
        productType: (f[4] ?? '').trim() || null,
        supportType: (f[5] ?? '').trim() || null,
        target: [(f[6] ?? '').trim(), (f[7] ?? '').trim(), (f[8] ?? '').trim()].filter(Boolean).join(' / ') || null,
        applyPeriod: [(f[20] ?? '').trim(), (f[21] ?? '').trim()].filter(Boolean).join(' ~ ') || null,
        amount: (f[11] ?? '').trim() || null,
        selectCount: (f[15] ?? '').trim() || null,
        rawData: { raw: f },
      },
    });
    saved += 1;
    if (saved % 100 === 0) console.log(`...${saved}`);
  }
  await prisma.$disconnect();
  console.log(`done: imported ${saved} scholarships`);
  process.exit(0);
}

void main().catch((e) => { console.error('import failed:', (e as Error).message); process.exit(1); });
