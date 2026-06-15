import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

const gradeSchema = z.object({
  term: z.string().trim().min(1).max(20), // 예: "2026-1"
  subject: z.string().trim().min(1).max(60),
  category: z.enum(['국어', '수학', '영어', '사회', '과학', '한국사', '제2외국어', '예체능', '기타']).optional(),
  score: z.coerce.number().min(0).max(100).optional(),
  rank: z.coerce.number().int().min(1).max(9).optional(),
  credits: z.coerce.number().int().min(1).max(20).optional(),
});

function userId(req: Request): string {
  const id = (req as Request & { user?: { id?: string } }).user?.id;
  if (!id) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  return id;
}

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class GradesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('grades')
  async list(@Req() req: Request) {
    const uid = userId(req);
    const grades = await this.prisma.grade.findMany({
      where: { userId: uid },
      orderBy: [{ term: 'asc' }, { subject: 'asc' }],
    });
    return { data: grades };
  }

  @Post('grades')
  async create(@Req() req: Request, @Body() body: unknown) {
    const uid = userId(req);
    const input = parseOrThrow(gradeSchema, body);
    const created = await this.prisma.grade.create({ data: { ...input, userId: uid } });
    return { data: created };
  }

  @Patch('grades/:id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const uid = userId(req);
    const input = parseOrThrow(gradeSchema.partial(), body);
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade || grade.userId !== uid) throw new AppError(ErrorCode.NOT_FOUND, '성적 항목을 찾을 수 없어요.');
    const updated = await this.prisma.grade.update({ where: { id }, data: input });
    return { data: updated };
  }

  @Delete('grades/:id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const uid = userId(req);
    const grade = await this.prisma.grade.findUnique({ where: { id } });
    if (!grade || grade.userId !== uid) throw new AppError(ErrorCode.NOT_FOUND, '성적 항목을 찾을 수 없어요.');
    await this.prisma.grade.delete({ where: { id } });
    return { data: { id } };
  }
}
