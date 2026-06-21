// reembed.ts — 임베딩 제공자/차원 변경 시 1회 실행.
// (1) pgvector 컬럼 차원을 현재 활성 차원(activeEmbeddingDim)으로 재생성
// (2) CareerJob / Major / CounselCase 전체를 새 임베딩으로 다시 채움
//
// 사용(운영, Voyage 활성화 후):
//   EMBEDDING_PROVIDER=voyage VOYAGE_API_KEY=... VOYAGE_DIM=1024 \
//   docker compose -f docker-compose.prod.yml exec -T api node dist/scripts/reembed.js
//
// ⚠️ 컬럼을 DROP/ADD 하므로 기존 임베딩은 지워지고 새로 채워진다(데이터 행 자체는 유지).
import { PrismaClient, Prisma } from '@prisma/client';
import { embedBatch, activeEmbeddingDim } from '../ai/embedding';

const TABLES: { table: string; idCol: string; textCols: string[] }[] = [
  { table: 'CareerJob', idCol: 'seq', textCols: ['name', 'summary', 'aptitude'] },
  { table: 'Major', idCol: 'majorSeq', textCols: ['name', 'summary'] },
  { table: 'CounselCase', idCol: 'seq', textCols: ['title', 'question'] },
];

async function main(): Promise<void> {
  const dim = activeEmbeddingDim();
  console.log(`[reembed] 활성 차원 = ${dim}`);
  const prisma = new PrismaClient();

  for (const t of TABLES) {
    // 1) 컬럼 차원 재생성 (차원이 바뀌면 ALTER로는 안 되므로 DROP/ADD)
    await prisma.$executeRawUnsafe(`ALTER TABLE "${t.table}" DROP COLUMN IF EXISTS "embedding"`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "${t.table}" ADD COLUMN "embedding" vector(${dim})`);
    console.log(`[reembed] ${t.table}.embedding → vector(${dim})`);

    // 2) 전체 재임베딩 (배치)
    const cols = [t.idCol, ...t.textCols].map((c) => `"${c}"`).join(', ');
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT ${cols} FROM "${t.table}"`);
    let done = 0;
    for (let i = 0; i < rows.length; i += 256) {
      const chunk = rows.slice(i, i + 256);
      const texts = chunk.map((r) => t.textCols.map((c) => (r[c] ?? '')).join(' ').trim());
      const vecs = await embedBatch(texts, 'document');
      for (let j = 0; j < chunk.length; j++) {
        const id = chunk[j]![t.idCol];
        const lit = `[${vecs[j]!.map((v) => v.toFixed(6)).join(',')}]`;
        await prisma.$executeRawUnsafe(`UPDATE "${t.table}" SET "embedding" = $1::vector WHERE "${t.idCol}" = $2`, lit, id);
      }
      done += chunk.length;
      console.log(`[reembed] ${t.table}: ${done}/${rows.length}`);
    }
  }
  console.log('[reembed] ✅ 완료');
  await prisma.$disconnect();
}

main().catch((e) => { console.error('[reembed] 실패:', e); process.exit(1); });
