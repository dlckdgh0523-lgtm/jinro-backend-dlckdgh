import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

const querySchema = z.object({
  country: z.string().trim().min(2).max(2).optional(), // ISO 2자리
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

type ForeignRow = {
  id: string;
  nameKo: string;
  nameEn: string | null;
  nameLocal: string | null;
  countryKo: string | null;
  countryEn: string | null;
  countryIso2: string | null;
  scorecardId: number | null;
  city: string | null;
  state: string | null;
  admissionRate: number | null;
  studentSize: number | null;
  tuitionInState: number | null;
  tuitionOutState: number | null;
  medianEarnings: number | null;
  completionRate: number | null;
};

// 적재된 College Scorecard 보강값을 프론트가 쓰기 좋은 형태로 노출.
// 값이 하나라도 있으면 hasDetail=true (미국 대학). 없으면 명칭만 (표준국문명칭).
function shape(u: ForeignRow) {
  const detail = {
    city: u.city,
    state: u.state,
    admissionRate: u.admissionRate, // 0~1
    studentSize: u.studentSize,
    tuitionInState: u.tuitionInState, // USD
    tuitionOutState: u.tuitionOutState, // USD
    medianEarnings: u.medianEarnings, // 졸업 6년 후 중위소득 USD
    completionRate: u.completionRate, // 0~1
  };
  const hasDetail = Object.values(detail).some((v) => v != null);
  return {
    id: u.id,
    nameKo: u.nameKo,
    nameEn: u.nameEn,
    nameLocal: u.nameLocal,
    country: { ko: u.countryKo, en: u.countryEn, iso2: u.countryIso2 },
    hasDetail,
    detail: hasDetail ? detail : null,
    source: hasDetail ? 'College Scorecard (U.S. Dept. of Education)' : '한국국제교류재단 표준국문명칭',
    confidence: 'confirmed' as const,
  };
}

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class ForeignUniversitiesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('foreign-universities')
  async list(@Query() query: Record<string, string>) {
    const { country, q, limit } = parseOrThrow(querySchema, query);
    const items = await this.prisma.foreignUniversity.findMany({
      where: {
        ...(country ? { countryIso2: country.toUpperCase() } : {}),
        ...(q
          ? {
              OR: [
                { nameKo: { contains: q } },
                { nameEn: { contains: q, mode: 'insensitive' } },
                { nameLocal: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      // 규모(재학생 수) 큰 대학 우선 — 미국은 데이터가 풍부한 주요 대학이 먼저 보이도록.
      orderBy: [{ studentSize: { sort: 'desc', nulls: 'last' } }, { nameKo: 'asc' }],
      take: limit,
    });
    const data = items.map(shape);
    return {
      data,
      meta: {
        source: '한국국제교류재단 표준국문명칭 + College Scorecard(미국)',
        count: data.length,
        detailCount: data.filter((d) => d.hasDetail).length,
        note: '미국 대학은 College Scorecard 학비·입학률·졸업률·졸업소득이 함께 제공됩니다.',
      },
    };
  }

  @Get('foreign-universities/:id')
  async detail(@Param('id') id: string) {
    const u = await this.prisma.foreignUniversity.findUnique({ where: { id } });
    if (!u) throw new AppError(ErrorCode.NOT_FOUND, '해외 대학을 찾을 수 없어요.');
    return { data: shape(u as ForeignRow) };
  }
}
