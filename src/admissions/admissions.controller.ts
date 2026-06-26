import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { JwtAuthGuard, type AuthedRequest } from '../auth/jwt.guard';
import { AppError, ErrorCode } from '../common/errors';
import { parseOrThrow, qLimit, qText } from '../common/zod';
import { Retriever } from '../ai/retriever';
import { seriesToTrack } from './dept-csv';

// 입시 조회 — 커리어넷 SCHOOL/MAJOR 적재 데이터 기반 (OPEN_QUESTIONS #8).
// 경쟁률·컷 등 미보유 수치는 confidence:'unavailable' — 프론트는 숫자를 표시하지 않는 게 계약.

const SOURCE = '커리어넷 진로정보망 (career.go.kr)';

function univType(estType: string | null): 'national' | 'private' | 'municipal' | 'special' {
  if (!estType) return 'private';
  if (estType.includes('국립')) return 'national';
  if (estType.includes('공립') || estType.includes('시립') || estType.includes('도립')) return 'municipal';
  if (estType.includes('특별') || estType.includes('특수')) return 'special';
  return 'private';
}

// 커리어넷 통칭 ↔ 대학알리미 정식명. 약칭으로 별도 School 레코드가 생겨 학과가 비는 명문대 보정.
const NAME_ALIASES: ReadonlyArray<readonly [string, string]> = [
  ['카이스트', '한국과학기술원'],
  ['KAIST', '한국과학기술원'],
  ['포스텍', '포항공과대학교'],
  ['POSTECH', '포항공과대학교'],
  ['지스트', '광주과학기술원'],
  ['GIST', '광주과학기술원'],
  ['유니스트', '울산과학기술원'],
  ['UNIST', '울산과학기술원'],
  ['디지스트', '대구경북과학기술원'],
  ['DGIST', '대구경북과학기술원'],
];

const listQuery = z.object({ region: qText, type: qText, q: qText, page: z.coerce.number().int().min(1).optional(), cursor: z.coerce.number().int().min(0).optional(), limit: qLimit });

// 프론트 지역 그룹 라벨 → School.region 부분문자열 집합
const REGION_GROUPS: Record<string, string[]> = {
  서울: ['서울'],
  '경기·인천': ['경기', '인천'],
  강원: ['강원'],
  충청: ['충청', '대전', '세종'],
  경상: ['경상', '부산', '대구', '울산'],
  전라: ['전라', '전북', '광주'],
  제주: ['제주'],
};
// 프론트 유형 라벨 → univType 결과값
const TYPE_KO: Record<string, string> = { 국립: 'national', 사립: 'private', 시립: 'municipal', 공립: 'municipal', 특수: 'special' };

@Controller('v1')
@UseGuards(JwtAuthGuard)
export class AdmissionsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly retriever: Retriever,
  ) {}

  @Get('admissions/universities')
  async listUniversities(@Query() query: Record<string, string>) {
    const { region, type, q, page, limit } = parseOrThrow(listQuery, query);
    const regionSubs = region && region !== '전체' ? (REGION_GROUPS[region] ?? [region]) : null;
    const where = {
      ...(q ? { name: { contains: q } } : {}),
      ...(regionSubs ? { OR: regionSubs.map((r) => ({ region: { contains: r } })) } : {}),
    };
    // 데이터셋이 작아(≈472교) 조건에 맞는 전체를 받아 유형 필터 후 페이지 슬라이스 — 정확한 총개수/페이지 보장.
    const rows = await this.prisma.school.findMany({ where, orderBy: { name: 'asc' } });
    let items = rows.map((s) => this.toUniversity(s));
    if (type && type !== '전체' && TYPE_KO[type]) items = items.filter((u) => u.type === TYPE_KO[type]);
    const total = items.length;
    const pageSize = limit;
    const pageNum = page ?? 1;
    const start = (pageNum - 1) * pageSize;
    const pageItems = items.slice(start, start + pageSize);
    return {
      data: pageItems,
      meta: {
        total,
        page: pageNum,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
        source: SOURCE,
        updatedAt: rows[0]?.updatedAt.toISOString() ?? null,
      },
    };
  }

  @Get('admissions/universities/:id')
  async getUniversity(@Param('id') id: string) {
    const school = await this.prisma.school.findUnique({ where: { seq: parseOrThrow(z.string().max(64), id) } });
    if (!school) throw new AppError(ErrorCode.NOT_FOUND, '대학 정보를 찾을 수 없어요.');
    // 대학알리미 보강 데이터 (ingestion이 raw.alimi/raw.admissions에 병합)
    const raw = school.raw as Record<string, unknown> | null;
    const alimi = raw?.['alimi'] as Record<string, unknown> | undefined;
    const stats = raw?.['admissions'] as Record<string, unknown> | undefined;
    // 취업률(학교 단위 집계) + 교환학생 (학교명 매칭)
    const [employmentAgg, exchange] = await Promise.all([
      this.prisma.universityEmploymentStat.aggregate({
        where: { schoolName: school.name },
        _avg: { employmentRate: true, primaryMaintain: true },
        _sum: { graduates: true, employed: true },
      }),
      this.prisma.universityExchangeStat.findFirst({
        where: { schoolName: school.name },
        orderBy: { svyYr: 'desc' },
      }),
    ]);
    // 입시통계(StudentService): 경쟁률·신입생 충원율·등록률. 미보유면 unavailable(프론트 숫자 미표시)
    const admissions = stats
      ? {
          ratio: stats['competitionRate'] != null ? `${stats['competitionRate']} : 1` : null,
          competitionRate: stats['competitionRate'] ?? null,
          freshmanFillRate: stats['freshmanFillRate'] ?? null,
          finalRegistrationRate: stats['finalRegistrationRate'] ?? null,
          recruit: null, // 모집인원은 학과 단위 공시 — 별도
          cut70: null,
          avg: null,
          svyYr: stats['svyYr'] ?? null,
          source: stats['source'] ?? '대학알리미 대학정보공시',
          confidence: 'confirmed' as const,
        }
      : { recruit: null, ratio: null, cut70: null, avg: null, confidence: 'unavailable' as const };
    return {
      data: {
        ...this.toUniversity(school),
        link: school.link,
        admissions,
        departments: [],
        // 졸업생 취업률 (학교 단위 평균)
        employment: employmentAgg._avg.employmentRate != null
          ? {
              avgRate: Number(employmentAgg._avg.employmentRate.toFixed(1)),
              maintainRate: employmentAgg._avg.primaryMaintain != null ? Number(employmentAgg._avg.primaryMaintain.toFixed(1)) : null,
              graduates: employmentAgg._sum.graduates ?? null,
              source: '경기데이터드림 졸업생 취업현황',
              confidence: 'confirmed' as const,
            }
          : { confidence: 'unavailable' as const },
        // 외국대학 교류 (국제화 지표)
        exchange: exchange
          ? {
              dispatched: exchange.dispatched,
              invited: exchange.invited,
              total: (exchange.dispatched ?? 0) + (exchange.invited ?? 0),
              svyYr: exchange.svyYr,
              source: '경기데이터드림 외국대학과의 교류현황',
              confidence: 'confirmed' as const,
            }
          : { confidence: 'unavailable' as const },
        publicInfo: alimi
          ? {
              schlId: (alimi['schlId'] as string) ?? null,
              schlKnd: (alimi['schlKndNm'] as string) ?? null,
              estType: (alimi['estbDivNm'] as string) ?? null,
              svyYr: (alimi['svyYr'] as string) ?? null,
              source: '대학알리미 (대학정보공시)',
              confidence: 'confirmed' as const,
            }
          : null,
        source: SOURCE,
        updatedAt: school.updatedAt.toISOString(),
      },
    };
  }

  // 대학별 학과 목록 — 화면에 "이 대학의 학과들"을 띄우는 엔드포인트 (대학알리미 공시).
  // 출처(svyYr·source)와 신설/폐지 상태를 함께 노출. AI가 아니라 적재 데이터가 진실의 원천.
  @Get('admissions/universities/:id/departments')
  async listDepartments(@Param('id') id: string, @Query() query: Record<string, string>) {
    const seq = parseOrThrow(z.string().max(64), id);
    const school = await this.prisma.school.findUnique({ where: { seq } });
    if (!school) throw new AppError(ErrorCode.NOT_FOUND, '대학 정보를 찾을 수 없어요.');
    const { track, includeInactive, q } = parseOrThrow(
      z.object({ track: qText, q: qText, includeInactive: z.string().optional().transform((v) => v === 'true') }),
      query,
    );
    // FK(schoolSeq) 우선, 미연결 데이터는 학교명 변형(국립 prefix, 캠퍼스 분리, 공백 차이)으로 폴백 매칭
    const nameCandidates = [school.name];
    const stripGukrip = school.name.replace(/^(국립|공립|사립)/, '').trim();
    if (stripGukrip !== school.name) nameCandidates.push(stripGukrip);
    const addGukrip = school.name.startsWith('국립') ? null : `국립${school.name}`;
    if (addGukrip) nameCandidates.push(addGukrip);
    // 통칭(커리어넷) ↔ 정식명(대학알리미) 별칭 — 약칭으로 별도 School 레코드가 잡혀 학과가 비는 경우.
    // 양방향 매칭(통칭으로 와도 정식명, 정식명으로 와도 통칭 후보를 추가).
    for (const [alias, formal] of NAME_ALIASES) {
      if (school.name === alias || stripGukrip === alias) nameCandidates.push(formal);
      if (school.name === formal || stripGukrip === formal) nameCandidates.push(alias);
    }
    // 캠퍼스 표기 차이: "고려대학교 세종캠퍼스"/"건국대학교 글로컬캠퍼스" → 본명 "고려대학교" + 캠퍼스 키워드.
    // (이전 정규식 /.+캠퍼스/ 는 탐욕적이라 대학명 전체를 먹어 빈 문자열이 되는 버그가 있었음)
    let campusHint: string | null = null;
    const cm = school.name.match(/\s+([^\s]*?)\s*캠퍼스/) || school.name.match(/\s+(글로컬|미래|세종|에리카|ERICA)\b/i);
    if (cm) campusHint = cm[1] || null;
    const stripCampus = school.name
      .replace(/\s+[^\s]*캠퍼스.*$/, '')
      .replace(/\s+(글로컬|미래|세종|에리카|ERICA)$/i, '')
      .trim();
    if (stripCampus && stripCampus !== school.name) {
      nameCandidates.push(stripCampus);
      const sc2 = stripCampus.replace(/^(국립|공립|사립)/, '').trim();
      if (sc2 !== stripCampus) nameCandidates.push(sc2);
    }

    let rows = await this.prisma.universityDepartment.findMany({
      where: {
        OR: [{ schoolSeq: seq }, { schoolName: { in: nameCandidates } }],
        ...(includeInactive ? {} : { active: true }),
        ...(q ? { name: { contains: q } } : {}),
      },
      orderBy: [{ college: 'asc' }, { name: 'asc' }],
      take: 2000,
    });
    // 분교(세종/글로컬 등): 해당 캠퍼스 학과가 있으면 그것만, 없으면 본교 기준으로 보여주되 주의문을 단다.
    // (대학알리미가 본교·분교 학과를 분리 제공하지 않는 경우가 많음 — 빈 화면보단 본교+캐비엇이 유용·정직)
    let campusNote: string | null = null;
    if (campusHint) {
      const campusRows = rows.filter((r) => (r.campus ?? '').includes(campusHint!));
      if (campusRows.length) rows = campusRows;
      else campusNote = `대학알리미가 본교·분교 학과를 분리 제공하지 않아, 아래는 본교(${stripCampus}) 기준 개설 학과예요. ${campusHint}캠퍼스 실제 개설 학과·모집인원은 입학처 모집요강에서 확인하세요.`;
    }
    // 프론트(admissions.jsx:42) 학과 카드는 { name, college, track(한글), recruit, conf }를 읽는다.
    let depts = rows.map((d) => ({
      id: d.id,
      name: d.name,
      college: d.college,
      track: seriesToTrack(d.seriesLarge), // 한글 '인문'|'자연'|'예체능'|null
      recruit: null, // 모집인원은 학과 목록 공시에 없음 — 별도 입시통계 API 필요 (프론트는 null이면 미표시)
      conf: 'confirmed' as const, // 프론트 필드명(conf). 공시 기반이라 confirmed
      // ─ 추가 정보(프론트 확장용) ─
      campus: d.campus,
      series: { large: d.seriesLarge, mid: d.seriesMid, small: d.seriesSmall },
      degree: d.degree,
      years: d.years,
      status: d.status,
      active: d.active,
    }));
    if (track) depts = depts.filter((d) => d.track === track);
    const svyYr = rows[0]?.svyYr ?? null;
    return {
      data: depts,
      meta: {
        total: depts.length,
        svyYr, // 조사년도 — "언제 기준 데이터인지" 항상 노출
        source: rows[0]?.source ?? '대학알리미 (대학정보공시)',
        updatedAt: rows[0]?.updatedAt.toISOString() ?? null,
        confidence: depts.length ? ('confirmed' as const) : ('unavailable' as const),
        note: [campusNote, svyYr ? `${svyYr}년 공시 기준이에요. 학과는 매년 신설·폐과될 수 있어 최신 모집요강도 함께 확인하세요.` : null].filter(Boolean).join(' ') || null,
      },
    };
  }

  @Get('admissions/search')
  async search(@Query() query: Record<string, string>) {
    const { q, limit } = parseOrThrow(z.object({ q: qText, track: qText, limit: qLimit }), query);
    if (!q) return { data: { universities: [], departments: [], offeringUniversities: [] }, meta: { source: SOURCE } };
    const [schools, majors, offering] = await Promise.all([
      this.prisma.school.findMany({ where: { name: { contains: q } }, take: limit }),
      this.prisma.major.findMany({ where: { name: { contains: q } }, take: limit }),
      // "이 학과를 개설한 대학" — 학과명으로 대학 역검색 (대학알리미 공시)
      this.prisma.universityDepartment.findMany({
        where: { name: { contains: q }, active: true },
        distinct: ['schoolName'],
        take: limit,
        orderBy: { schoolName: 'asc' },
      }),
    ]);
    return {
      data: {
        universities: schools.map((s) => this.toUniversity(s)),
        departments: majors.map((m) => ({
          id: String(m.majorSeq),
          name: m.name,
          college: m.field,
          track: null,
          recruit: null,
          confidence: 'estimated' as const,
        })),
        // 학과명으로 검색 시 그 학과를 개설한 대학 목록 (confirmed — 공시 기반)
        offeringUniversities: offering.map((d) => ({
          schoolName: d.schoolName,
          schoolSeq: d.schoolSeq,
          department: d.name,
          college: d.college,
          track: seriesToTrack(d.seriesLarge),
          svyYr: d.svyYr,
          confidence: 'confirmed' as const,
        })),
      },
      meta: { source: SOURCE },
    };
  }

  @Get('admissions/analysis')
  analysis(): never {
    throw new AppError(ErrorCode.NOT_IMPLEMENTED, 'AI 입시 격차 분석은 준비 중이에요.');
  }

  // ─── 진로 목표 (§5) ───

  @Post('career/target')
  @HttpCode(201)
  async createTarget(@Req() req: AuthedRequest, @Body() body: unknown) {
    const input = parseOrThrow(
      z.object({
        career: z.string().trim().min(1).max(100),
        univ: z.string().trim().max(100).optional(),
        dept: z.string().trim().max(100).optional(),
        track: z.string().trim().max(30).optional(),
        reason: z.string().trim().max(1_000).optional(),
      }),
      body,
    );
    // 진로목표는 학생이 언제든 추가/변경 — 사용자 요청: "워낙에 생각이 많기도 하고 언제든 바뀔 가능성".
    // 무제한은 위험하니 합리적 상한(20개)만. 같은 (career,univ,dept) 중복은 차단.
    const MAX_TARGETS = 20;
    const count = await this.prisma.careerTarget.count({ where: { userId: req.user.id } });
    if (count >= MAX_TARGETS) {
      throw new AppError(ErrorCode.CONFLICT, `진로 목표는 최대 ${MAX_TARGETS}개까지 등록할 수 있어요. 오래된 항목을 정리한 뒤 다시 시도해주세요.`);
    }
    const dup = await this.prisma.careerTarget.findFirst({
      where: { userId: req.user.id, career: input.career, univ: input.univ ?? null, dept: input.dept ?? null },
    });
    if (dup) return { data: { ...dup, createdAt: dup.createdAt.toISOString(), duplicate: true } };
    const target = await this.prisma.careerTarget.create({ data: { userId: req.user.id, ...input } });

    // 담임 교사 알림 — 같은 학교/학급 교사에게 "○○ 학생이 진로를 변경했어요"
    // 베스트 에포트: 실패해도 본 요청 흐름은 막지 않음(catch 안에서 silent).
    try {
      const student = await this.prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true, school: true, classroom: true } });
      if (student && student.school && student.classroom) {
        const teachers = await this.prisma.user.findMany({
          where: { role: 'teacher', school: student.school, classroom: student.classroom },
          select: { id: true },
        });
        if (teachers.length) {
          const label = [target.career, target.univ, target.dept].filter(Boolean).join(' · ');
          await this.prisma.notification.createMany({
            data: teachers.map((t) => ({
              userId: t.id,
              type: 'student.career_target_changed',
              dedupeKey: `target:${target.id}`,
              title: `${student.name} 학생의 진로 목표가 추가됐어요`,
              body: label,
              targetUrl: `/teacher/students/${req.user.id}`,
              payload: { studentId: req.user.id, targetId: target.id, career: target.career, univ: target.univ, dept: target.dept } as Prisma.InputJsonValue,
            })),
            skipDuplicates: true,
          });
        }
      }
    } catch (e) { /* silent — 알림 실패가 본 흐름을 막지 않음 */ }

    return { data: { ...target, createdAt: target.createdAt.toISOString() } };
  }

  @Get('career/targets')
  async listTargets(@Req() req: AuthedRequest) {
    const targets = await this.prisma.careerTarget.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'asc' } });
    return { data: targets.map((t) => ({ ...t, createdAt: t.createdAt.toISOString() })) };
  }

  // AI 추천 트리거 — 적재 데이터 기반 retriever 추천 (가벼운 동기 응답)
  @Post('career/recommendation')
  @HttpCode(200)
  async recommend(@Req() req: AuthedRequest, @Body() body: unknown) {
    const { query } = parseOrThrow(z.object({ query: z.string().trim().min(1).max(500) }), body);
    const docs = await this.retriever.retrieve(query, 6);
    return {
      data: docs.map((d) => ({ kind: d.kind, id: d.id, title: d.title, why: d.body.slice(0, 120), score: Math.round(d.score * 1000) / 1000 })),
      meta: { source: SOURCE },
    };
  }

  private toUniversity(s: { seq: string; name: string; region: string | null; estType: string | null; gubun: string | null }) {
    return {
      id: s.seq,
      name: s.name,
      short: s.name.replace(/대학교$/, '대'),
      region: s.region,
      type: univType(s.estType),
      deptCount: null,
      confidence: 'confirmed' as const,
    };
  }
}
