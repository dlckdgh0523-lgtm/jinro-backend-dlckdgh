import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';

const querySchema = z.object({
  // C/E/M/I/J/V/U — 학년 코드 (커리어넷 COSE target)
  target: z.enum(['C', 'E', 'M', 'I', 'J', 'V', 'U']).optional(),
  // 활동 유형 (한국어)
  activity: z
    .enum(['진로심리검사', '진로상담', '직업정보', '진로·직업체험', '창업가정신 함양 교육', '학교·학과 정보', '진로수업 및 창의적 체험활동 운영', '학교·학급 운영', '기타'])
    .optional(),
  q: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('career-materials')
  async list(@Query() query: Record<string, string>) {
    const { target, activity, q, limit } = parseOrThrow(querySchema, query);
    const items = await this.prisma.careerEducationMaterial.findMany({
      where: {
        // target 지정 시 해당 학년 + 공통(C) 모두
        ...(target ? { target: { in: [target, 'C'] } } : {}),
        ...(activity ? { activityType: activity } : {}),
        ...(q ? { title: { contains: q } } : {}),
      },
      orderBy: { selCount: 'desc' },
      take: limit,
    });
    return {
      data: items.map((m) => ({
        seq: m.seq,
        title: m.title,
        author: m.author,
        year: m.year,
        activityType: m.activityType,
        target: m.target,
        attFile: m.attFile,
        confidence: 'confirmed' as const,
      })),
      meta: { source: '커리어넷 진로교육자료', count: items.length },
    };
  }
}
