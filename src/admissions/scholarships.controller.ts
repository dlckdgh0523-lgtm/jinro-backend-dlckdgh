import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';

const querySchema = z.object({
  q: z.string().trim().max(80).optional(),
  organization: z.string().trim().max(50).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class ScholarshipsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('scholarships')
  async list(@Query() query: Record<string, string>) {
    const { q, organization, limit } = parseOrThrow(querySchema, query);
    const items = await this.prisma.scholarship.findMany({
      where: {
        ...(q ? { OR: [{ productName: { contains: q } }, { target: { contains: q } }] } : {}),
        ...(organization ? { organization: { contains: organization } } : {}),
      },
      orderBy: { id: 'desc' },
      take: limit,
    });
    return {
      data: items.map((s) => ({
        id: s.id,
        organization: s.organization,
        productName: s.productName,
        productType: s.productType,
        supportType: s.supportType,
        target: s.target,
        applyPeriod: s.applyPeriod,
        amount: s.amount,
        selectCount: s.selectCount,
        confidence: 'confirmed' as const,
      })),
      meta: { source: '한국장학재단', count: items.length, note: '구체 신청 조건은 운영기관 공지로 확인하세요.' },
    };
  }
}
