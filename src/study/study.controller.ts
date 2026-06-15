import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

const taskSchema = z.object({
  title: z.string().trim().min(1).max(160),
  subject: z.string().trim().max(60).optional(),
  weekKey: z.string().trim().min(1).max(20), // 예: "2026-W24"
  dueDate: z.string().datetime().optional(),
  done: z.boolean().optional(),
});

const querySchema = z.object({ weekKey: z.string().trim().max(20).optional() });

function userId(req: Request): string {
  const id = (req as Request & { user?: { id?: string } }).user?.id;
  if (!id) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  return id;
}

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class StudyController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('study-tasks')
  async list(@Req() req: Request, @Query() query: Record<string, string>) {
    const uid = userId(req);
    const { weekKey } = parseOrThrow(querySchema, query);
    const tasks = await this.prisma.studyTask.findMany({
      where: { userId: uid, ...(weekKey ? { weekKey } : {}) },
      orderBy: [{ weekKey: 'asc' }, { createdAt: 'asc' }],
    });
    return { data: tasks };
  }

  @Post('study-tasks')
  async create(@Req() req: Request, @Body() body: unknown) {
    const uid = userId(req);
    const input = parseOrThrow(taskSchema, body);
    const created = await this.prisma.studyTask.create({
      data: { ...input, dueDate: input.dueDate ? new Date(input.dueDate) : null, userId: uid },
    });
    return { data: created };
  }

  @Patch('study-tasks/:id')
  async update(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const uid = userId(req);
    const input = parseOrThrow(taskSchema.partial(), body);
    const task = await this.prisma.studyTask.findUnique({ where: { id } });
    if (!task || task.userId !== uid) throw new AppError(ErrorCode.NOT_FOUND, '학습 항목을 찾을 수 없어요.');
    const updated = await this.prisma.studyTask.update({
      where: { id },
      data: { ...input, ...(input.dueDate ? { dueDate: new Date(input.dueDate) } : {}) },
    });
    return { data: updated };
  }

  @Delete('study-tasks/:id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const uid = userId(req);
    const task = await this.prisma.studyTask.findUnique({ where: { id } });
    if (!task || task.userId !== uid) throw new AppError(ErrorCode.NOT_FOUND, '학습 항목을 찾을 수 없어요.');
    await this.prisma.studyTask.delete({ where: { id } });
    return { data: { id } };
  }
}
