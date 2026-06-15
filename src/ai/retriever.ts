import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { embed, toVectorLiteral } from './embedding';
import { PrismaService } from '../db/prisma.service';
import { logger } from '../common/logger';

// 하이브리드 RAG retriever — pgvector cosine + tsvector(simple) 키워드, RRF 병합 (DECISIONS #10).
// 컨텍스트 소스: career/가 적재한 직업백과·학과·상담사례.

export interface RetrievedDoc {
  kind: 'job' | 'major' | 'counsel';
  id: number;
  title: string;
  body: string;
  score: number;
}

interface RankRow {
  id: number;
  title: string;
  body: string;
}

const RRF_K = 60;

@Injectable()
export class Retriever {
  constructor(private readonly prisma: PrismaService) {}

  async retrieve(query: string, topK = 6): Promise<RetrievedDoc[]> {
    const [jobs, majors, counsel] = await Promise.all([
      this.hybrid('job', query, topK),
      this.hybrid('major', query, topK),
      this.hybrid('counsel', query, Math.ceil(topK / 2)),
    ]);
    return [...jobs, ...majors, ...counsel].sort((a, b) => b.score - a.score).slice(0, topK);
  }

  private parts(kind: 'job' | 'major' | 'counsel') {
    const table = kind === 'job' ? 'CareerJob' : kind === 'major' ? 'Major' : 'CounselCase';
    const idCol = kind === 'major' ? 'majorSeq' : 'seq';
    const titleCol = kind === 'counsel' ? 'title' : 'name';
    const bodyExpr =
      kind === 'job'
        ? `coalesce("summary",'') || ' ' || coalesce("aptitude",'') || ' ' || coalesce("prospect",'')`
        : kind === 'major'
          ? `coalesce("summary",'') || ' ' || array_to_string("departments", ', ')`
          : `coalesce("question",'') || ' ' || coalesce("answer",'')`;
    return {
      select: Prisma.raw(`SELECT "${idCol}" AS id, "${titleCol}" AS title, ${bodyExpr} AS body FROM "${table}"`),
      tsExpr: Prisma.raw(`to_tsvector('simple', "${titleCol}" || ' ' || ${bodyExpr})`),
      titleCol: Prisma.raw(`"${titleCol}"`),
    };
  }

  private async hybrid(kind: 'job' | 'major' | 'counsel', query: string, topK: number): Promise<RetrievedDoc[]> {
    const vecLit = toVectorLiteral(embed(query));
    const { select, tsExpr, titleCol } = this.parts(kind);
    const limit = Math.max(1, Math.min(topK, 20));

    let vectorRows: RankRow[] = [];
    let textRows: RankRow[] = [];
    try {
      vectorRows = await this.prisma.$queryRaw<RankRow[]>(
        Prisma.sql`${select} WHERE "embedding" IS NOT NULL ORDER BY "embedding" <=> ${vecLit}::vector ASC LIMIT ${limit}`,
      );
    } catch (e) {
      logger.warn({ kind, err: (e as Error).message }, 'vector search failed — text only');
    }
    try {
      // 사용자 입력은 파라미터 바인딩 (인젝션 방어)
      textRows = await this.prisma.$queryRaw<RankRow[]>(
        Prisma.sql`${select} WHERE ${tsExpr} @@ plainto_tsquery('simple', ${query}) LIMIT ${limit}`,
      );
    } catch (e) {
      logger.warn({ kind, err: (e as Error).message }, 'text search failed');
    }
    // 키워드 부분일치 폴백 (simple config가 한국어 조사를 못 자르는 케이스 보강)
    if (textRows.length === 0 && query.trim()) {
      const like = `%${query.trim().slice(0, 50)}%`;
      try {
        textRows = await this.prisma.$queryRaw<RankRow[]>(
          Prisma.sql`${select} WHERE ${titleCol} LIKE ${like} LIMIT ${limit}`,
        );
      } catch (e) {
        logger.warn({ kind, err: (e as Error).message }, 'like fallback failed');
      }
    }

    // RRF 병합
    const scores = new Map<number, { row: RankRow; score: number }>();
    vectorRows.forEach((row, i) => {
      const cur = scores.get(row.id) ?? { row, score: 0 };
      cur.score += 1 / (RRF_K + i + 1);
      scores.set(row.id, cur);
    });
    textRows.forEach((row, i) => {
      const cur = scores.get(row.id) ?? { row, score: 0 };
      cur.score += 1 / (RRF_K + i + 1);
      scores.set(row.id, cur);
    });
    return [...scores.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ row, score }) => ({
        kind,
        id: Number(row.id),
        title: row.title,
        body: (row.body || '').slice(0, 500),
        score,
      }));
  }
}
