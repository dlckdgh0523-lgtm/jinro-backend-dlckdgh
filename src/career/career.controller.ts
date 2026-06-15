import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { CareerService } from './career.service';
import { parseOrThrow, qCursor, qLimit, qText } from '../common/zod';
import { JwtAuthGuard } from '../auth/jwt.guard';

const listQuery = z.object({ q: qText, theme: qText, cursor: qCursor, limit: qLimit });
const schoolQuery = z.object({ q: qText, region: qText, gubun: qText, cursor: qCursor, limit: qLimit });
const seqParam = z.coerce.number().int().positive().max(2_147_483_647); // PG Int 오버플로 방어

@Controller('v1/career')
@UseGuards(JwtAuthGuard)
export class CareerController {
  constructor(private readonly career: CareerService) {}

  @Get('jobs')
  listJobs(@Query() query: Record<string, string>) {
    const { q, theme, cursor, limit } = parseOrThrow(listQuery, query);
    return this.career.listJobs(q, theme, cursor, limit);
  }

  @Get('jobs/:seq')
  getJob(@Param('seq') seq: string) {
    return this.career.getJob(parseOrThrow(seqParam, seq));
  }

  @Get('junior-jobs')
  listJuniorJobs(@Query() query: Record<string, string>) {
    const { q, cursor, limit } = parseOrThrow(listQuery, query);
    return this.career.listJuniorJobs(q, cursor, limit);
  }

  @Get('junior-jobs/:seq')
  getJuniorJob(@Param('seq') seq: string) {
    return this.career.getJuniorJob(parseOrThrow(seqParam, seq));
  }

  @Get('majors')
  listMajors(@Query() query: Record<string, string>) {
    const { q, cursor, limit } = parseOrThrow(listQuery, query);
    return this.career.listMajors(q, cursor, limit);
  }

  @Get('majors/:seq')
  getMajor(@Param('seq') seq: string) {
    return this.career.getMajor(parseOrThrow(seqParam, seq));
  }

  @Get('schools')
  listSchools(@Query() query: Record<string, string>) {
    const { q, region, gubun, cursor, limit } = parseOrThrow(schoolQuery, query);
    return this.career.listSchools(q, region, gubun, cursor, limit);
  }

  @Get('counseling-cases')
  listCounselCases(@Query() query: Record<string, string>) {
    const { q, cursor, limit } = parseOrThrow(listQuery, query);
    return this.career.listCounselCases(q, cursor, limit);
  }

  @Get('education-materials')
  listEduMaterials(@Query() query: Record<string, string>) {
    const { q, cursor, limit } = parseOrThrow(listQuery, query);
    return this.career.listEduMaterials(q, cursor, limit);
  }

  @Get('tests')
  listTests() {
    return this.career.listTests();
  }
}
