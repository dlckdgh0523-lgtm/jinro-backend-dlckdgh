import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import type { Request } from 'express';
import { JwtAuthGuard, type AuthUser } from '../auth/jwt.guard';
import { PrismaService } from '../db/prisma.service';
import { NotificationsService } from '../realtime/notifications.service';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

function user(req: Request): AuthUser {
  const u = (req as Request & { user?: AuthUser }).user;
  if (!u) throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
  return u;
}
function fmtKo(d: Date): string {
  return d.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const createSchema = z.object({
  teacherId: z.string().trim().optional(),
  topic: z.string().trim().min(1).max(120),
  note: z.string().trim().max(1000).optional(),
  preferredAt: z.string().datetime().optional(),
});
const acceptSchema = z.object({ at: z.string().datetime(), note: z.string().trim().max(500).optional() });
const declineSchema = z.object({ note: z.string().trim().max(500).optional() });

@Controller('v1/counseling-requests')
@UseGuards(JwtAuthGuard)
export class CounselingRequestsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // 학생: 상담 요청 생성 (teacherId 없으면 같은 학급 교사 자동 매칭)
  @Post()
  async create(@Req() req: Request, @Body() body: unknown) {
    const me = user(req);
    if (me.role !== 'student') throw new AppError(ErrorCode.AUTH_FORBIDDEN, '학생만 상담을 요청할 수 있어요.');
    const input = parseOrThrow(createSchema, body);
    const student = await this.prisma.user.findUnique({ where: { id: me.id } });
    let teacherId = input.teacherId;
    if (!teacherId) {
      const teacher = await this.prisma.user.findFirst({
        where: { role: 'teacher', ...(student?.school ? { school: student.school } : {}), ...(student?.classroom ? { classroom: student.classroom } : {}) },
      });
      if (!teacher) throw new AppError(ErrorCode.NOT_FOUND, '담당 선생님을 찾을 수 없어요. 학교/반 정보를 확인해주세요.');
      teacherId = teacher.id;
    }
    const reqRow = await this.prisma.counselingRequest.create({
      data: { studentId: me.id, teacherId, topic: input.topic, note: input.note ?? null, preferredAt: input.preferredAt ? new Date(input.preferredAt) : null },
    });
    await this.notifications.notify(teacherId, {
      type: 'counseling.request', dedupeKey: `creq-${reqRow.id}`,
      title: '새 상담 요청이 왔어요', body: `${me.name} 학생 · ${input.topic}`, targetUrl: '#teacher-web',
    });
    return { data: reqRow };
  }

  // 목록 — 교사: 나에게 온 요청, 학생: 내가 보낸 요청
  @Get()
  async list(@Req() req: Request) {
    const me = user(req);
    const where = me.role === 'teacher' ? { teacherId: me.id } : { studentId: me.id };
    const rows = await this.prisma.counselingRequest.findMany({
      where,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: 100,
      include: { student: { select: { id: true, name: true, grade: true } }, teacher: { select: { id: true, name: true } } },
    });
    return {
      data: rows.map((r) => ({
        id: r.id, topic: r.topic, note: r.note, status: r.status,
        preferredAt: r.preferredAt?.toISOString() ?? null, scheduledAt: r.scheduledAt?.toISOString() ?? null,
        decisionNote: r.decisionNote,
        student: r.student, teacher: r.teacher, createdAt: r.createdAt.toISOString(),
      })),
    };
  }

  // 교사: 수락 → 확정 시각으로 양측 캘린더 이벤트 생성 + 학생 알림
  @Post(':id/accept')
  async accept(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const me = user(req);
    if (me.role !== 'teacher' && me.role !== 'admin') throw new AppError(ErrorCode.AUTH_FORBIDDEN, '교사만 수락할 수 있어요.');
    const input = parseOrThrow(acceptSchema, body);
    const reqRow = await this.prisma.counselingRequest.findUnique({ where: { id }, include: { student: true, teacher: true } });
    if (!reqRow) throw new AppError(ErrorCode.NOT_FOUND, '상담 요청을 찾을 수 없어요.');
    if (me.role === 'teacher' && reqRow.teacherId !== me.id) throw new AppError(ErrorCode.AUTH_FORBIDDEN, '본인에게 온 요청만 수락할 수 있어요.');
    const at = new Date(input.at);
    await this.prisma.counselingRequest.update({ where: { id }, data: { status: 'accepted', scheduledAt: at, decisionNote: input.note ?? null } });
    // 양측 캘린더 이벤트 (refType+refId로 멱등·미러 추적)
    const ev = (userId: string, title: string) => ({
      where: { userId_refType_refId: { userId, refType: 'counseling', refId: id } },
      create: { userId, title, category: 'counseling', startsAt: at, location: '', notes: reqRow.topic, refType: 'counseling', refId: id },
      update: { title, startsAt: at, notes: reqRow.topic },
    });
    await this.prisma.calendarEvent.upsert(ev(reqRow.teacherId, `[상담] ${reqRow.student.name} 학생`));
    await this.prisma.calendarEvent.upsert(ev(reqRow.studentId, `[상담] ${reqRow.teacher.name} 선생님`));
    await this.notifications.notify(reqRow.studentId, {
      type: 'counseling.accepted', dedupeKey: `creq-accept-${id}`,
      title: '상담이 확정됐어요', body: `${reqRow.teacher.name} 선생님과 ${fmtKo(at)} 상담이 확정됐어요.${input.note ? ` (${input.note})` : ''}`,
      targetUrl: '#student-web',
    });
    return { data: { id, status: 'accepted', scheduledAt: at.toISOString() } };
  }

  // 교사: 거절 → 학생 알림(사유)
  @Post(':id/decline')
  async decline(@Req() req: Request, @Param('id') id: string, @Body() body: unknown) {
    const me = user(req);
    if (me.role !== 'teacher' && me.role !== 'admin') throw new AppError(ErrorCode.AUTH_FORBIDDEN, '교사만 처리할 수 있어요.');
    const input = parseOrThrow(declineSchema, body);
    const reqRow = await this.prisma.counselingRequest.findUnique({ where: { id }, include: { teacher: true } });
    if (!reqRow) throw new AppError(ErrorCode.NOT_FOUND, '상담 요청을 찾을 수 없어요.');
    if (me.role === 'teacher' && reqRow.teacherId !== me.id) throw new AppError(ErrorCode.AUTH_FORBIDDEN, '본인에게 온 요청만 처리할 수 있어요.');
    await this.prisma.counselingRequest.update({ where: { id }, data: { status: 'declined', decisionNote: input.note ?? null } });
    await this.notifications.notify(reqRow.studentId, {
      type: 'counseling.declined', dedupeKey: `creq-decline-${id}`,
      title: '상담 요청이 보류됐어요', body: input.note ? `사유: ${input.note}` : '선생님이 일정을 다시 조율할 거예요.',
      targetUrl: '#student-web',
    });
    return { data: { id, status: 'declined' } };
  }
}
