import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';

const querySchema = z.object({
  region: z.string().trim().max(40).optional(),
  q: z.string().trim().max(100).optional(),
  youthOnly: z.string().optional().transform((v) => v === 'true'),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class VolunteersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('volunteers')
  async list(@Query() query: Record<string, string>) {
    const { region, q, youthOnly, limit } = parseOrThrow(querySchema, query);
    const now = new Date();
    const items = await this.prisma.volunteerOpportunity.findMany({
      where: {
        ...(youthOnly ? { youthEligible: true } : {}),
        OR: [{ recruitTo: null }, { recruitTo: { gte: now } }],
        ...(region ? { region: { contains: region } } : {}),
        ...(q ? { title: { contains: q } } : {}),
      },
      // 청소년 가능 항목을 먼저, 그다음 최신순
      orderBy: [{ youthEligible: 'desc' }, { id: 'desc' }],
      take: limit,
    });
    return {
      data: items.map((v) => {
        const raw = (v.raw ?? {}) as Record<string, unknown>;
        return {
          id: v.id,
          title: v.title,
          center: v.centerName,
          activityType: v.centerType, // 활동유형(각종행사보조/교육지원/시설봉사 등) 또는 기관유형
          region: v.region,
          place: v.address, // 활동 장소
          recruitCount: v.recruitCount, // 모집 인원
          status: (raw['statusName'] as string) ?? null, // 모집중/모집완료
          termType: (raw['termTypeName'] as string) ?? null, // 정기/비정기
          youthEligible: v.youthEligible, // 청소년 가능 여부
          contact: v.contact,
          confidence: 'confirmed' as const,
        };
      }),
      meta: {
        source: '한국사회복지협의회 VMS',
        count: items.length,
        note: '활동 장소·유형·모집인원은 VMS 모집공고 기준이에요. 구체적 활동 일자·시간·봉사시간은 VMS(1365)에서 신청 시 확인돼요.',
      },
    };
  }
}
