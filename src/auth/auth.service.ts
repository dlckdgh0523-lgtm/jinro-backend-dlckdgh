import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../db/prisma.service';
import { AppError, ErrorCode } from '../common/errors';
import { env } from '../common/env';
import { createRedis } from '../common/redis';
import { logger } from '../common/logger';
import type { Role, User } from '@prisma/client';

// 로그인 실패 잠금 — Redis 카운터로 계정 단위 잠금. 5회 실패 → 5분 잠금.
// 사용자 피드백: 15분은 너무 김. brute-force는 5분에 5회면 ~분당 1회 시도라 충분히 막힘.
// IP 단위 throttler(5/min/IP)와 별개 — 계정 단위라 IP 우회 brute-force도 차단.
const LOGIN_FAIL_MAX = 5;
const LOGIN_LOCK_SEC = 5 * 60;
const lockoutRedis = createRedis('auth-lockout');
const lockoutKey = (email: string) => `auth:lockout:${email.toLowerCase()}`;

export interface Consents {
  tos: boolean;
  privacy: boolean;
  academic: boolean;
  ai: boolean;
  age: boolean;
  mkt?: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private requireConsents(consents: Consents): void {
    const required: (keyof Consents)[] = ['tos', 'privacy', 'academic', 'ai', 'age'];
    const missing = required.filter((k) => consents[k] !== true);
    if (missing.length) {
      // 만 14세 미만(age 미동의)은 별도 코드로 — 프론트 §1 "만 14세 미만 가입 차단"
      if (missing.includes('age')) {
        throw new AppError(ErrorCode.AUTH_AGE_RESTRICTED, '만 14세 이상만 가입할 수 있어요.');
      }
      throw new AppError(ErrorCode.AUTH_CONSENT_REQUIRED, '필수 약관에 동의해주세요.', { details: { missing } });
    }
  }

  async signupStudent(input: { email: string; password: string; name: string; inviteCode?: string; grade?: string; consents: Consents }) {
    // 초대코드가 있으면 해당 교사의 학교/반을 상속해 학급에 자동 참여.
    let school: string | undefined;
    let classroom: string | undefined;
    const code = input.inviteCode?.trim().toUpperCase();
    if (code) {
      const teacher = await this.prisma.user.findUnique({ where: { inviteCode: code } });
      if (!teacher || teacher.role !== 'teacher') {
        throw new AppError(ErrorCode.VALIDATION_FAILED, '유효하지 않은 초대코드예요.');
      }
      school = teacher.school ?? undefined;
      classroom = teacher.classroom ?? undefined;
    }
    return this.signup({ ...input, role: 'student', school, classroom });
  }

  async signupTeacher(input: { email: string; password: string; name: string; school: string; classroom: string; consents: Consents }) {
    return this.signup({ ...input, role: 'teacher' });
  }

  private async signup(input: {
    email: string;
    password: string;
    name: string;
    role: Role;
    school?: string;
    classroom?: string;
    grade?: string;
    consents: Consents;
  }) {
    this.requireConsents(input.consents);
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new AppError(ErrorCode.AUTH_EMAIL_TAKEN, '이미 가입된 이메일이에요.');
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash: await bcrypt.hash(input.password, 10),
        name: input.name,
        role: input.role,
        school: input.school,
        classroom: input.classroom,
        grade: input.grade,
        consents: input.consents as object,
      },
    });
    const tokens = await this.issueTokens(user);
    return { ...tokens, user: this.toUserDto(user) };
  }

  // 소셜 로그인 — 이메일로 기존 계정 매칭, 없으면 학생으로 생성(미완성: grade 없음 → 온보딩 유도).
  // 기존 사용자(다음번)는 연동된 그 계정으로 바로 로그인. 신규는 needsProfile=true로 온보딩 진입.
  async oauthLogin(input: { email: string; name: string; provider: 'google' | 'kakao'; desiredRole?: 'student' | 'teacher' }): Promise<{ accessToken: string; refreshToken: string; role: Role; isNew: boolean; needsProfile: boolean; name: string; email: string }> {
    const email = input.email.trim().toLowerCase();
    let user = await this.prisma.user.findUnique({ where: { email } });
    let isNew = false;
    if (!user) {
      isNew = true;
      // 신규 가입: 시작 URL의 ?role=teacher 힌트에 따라 role 결정 (기본 학생).
      // 기존 사용자라면 desiredRole 무시 — role 변경은 별도 정책.
      const role: Role = input.desiredRole === 'teacher' ? 'teacher' : 'student';
      user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: await bcrypt.hash(randomUUID(), 10), // 비밀번호 로그인 불가(소셜 전용)
          name: input.name?.trim() || email.split('@')[0],
          role,
          // 동의/학년/학급은 온보딩에서 받는다 — 학생은 grade, 교사는 school/classroom 미설정
          consents: { oauth: input.provider } as object,
        },
      });
    }
    if (user.status !== 'active') {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, '이용이 제한된 계정이에요. 고객센터에 문의해주세요.');
    }
    const tokens = await this.issueTokens(user);
    const needsProfile = user.role === 'student' && !user.grade; // 학년 없으면 온보딩 필요
    return { ...tokens, role: user.role, isNew, needsProfile, name: user.name, email: user.email };
  }

  // OAuth 온보딩 완료 — 이름/학년/필수동의 입력 반영.
  async completeProfile(userId: string, input: { name?: string; grade?: string; consents?: Consents; tourCompleted?: boolean }) {
    if (input.consents) this.requireConsents(input.consents);
    const data: { name?: string; grade?: string; consents?: object; tourCompleted?: boolean } = {};
    if (input.name?.trim()) data.name = input.name.trim();
    if (input.grade) data.grade = input.grade;
    if (input.consents) data.consents = input.consents as object;
    if (typeof input.tourCompleted === 'boolean') data.tourCompleted = input.tourCompleted;
    const user = await this.prisma.user.update({ where: { id: userId }, data });
    return this.toUserDto(user);
  }

  async login(input: { email: string; password: string; role?: Role }, ctx?: { ip?: string; ua?: string }) {
    // 계정 잠금 체크 — Redis 카운터(키 auth:lockout:<email>). N회 실패 시 잠금.
    // Redis 다운 시 throw 안 함(베스트 에포트 잠금 — 다운돼도 로그인은 가능, 보안은 throttler가 1차 방어).
    const lkey = lockoutKey(input.email);
    let failCount = 0;
    try { failCount = Number((await lockoutRedis.get(lkey)) || 0); } catch (e) { logger.warn({ err: (e as Error).message }, 'login lockout redis read failed'); }
    if (failCount >= LOGIN_FAIL_MAX) {
      // 남은 잠금 시간 알림 — 사용자가 "얼마나 더 기다려야 하는지" 정확히 알 수 있게
      let ttl = 0;
      try { ttl = await lockoutRedis.ttl(lkey); } catch (e) { /* silent */ }
      const min = ttl > 0 ? Math.ceil(ttl / 60) : 5;
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, `로그인 시도가 너무 많아요. ${min}분 후 다시 시도하거나 비밀번호 찾기를 이용해주세요. (보안 잠금)`);
    }

    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    const passwordOk = user && (await bcrypt.compare(input.password, user.passwordHash));
    if (!user || !passwordOk) {
      // 실패 카운터 증가 — TTL 15분(슬라이딩 윈도 아님. 임계 도달 후 15분 잠금)
      try {
        const c = await lockoutRedis.incr(lkey);
        if (c === 1) await lockoutRedis.expire(lkey, LOGIN_LOCK_SEC);
      } catch (e) { /* 로깅만 */ }
      throw new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, '이메일 또는 비밀번호가 올바르지 않아요.');
    }
    if (user.status !== 'active') {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, '이용이 제한된 계정이에요. 고객센터에 문의해주세요.');
    }
    if (input.role && user.role !== input.role) {
      // 역할 불일치도 invalid credentials로 응답 (계정 존재 노출 방지)
      throw new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, '이메일 또는 비밀번호가 올바르지 않아요.');
    }
    // 성공 — 카운터 초기화
    try { await lockoutRedis.del(lkey); } catch (e) { /* silent */ }

    // 의심 IP 알림 — Redis에 최근 본 IP 30개를 user별로 보관(SET, 90일 TTL).
    // 처음 보는 IP면 본인 알림 + AuditLog 기록. 사용자가 "이건 내가 아님" 알아챌 단서.
    if (ctx?.ip) {
      try {
        const ipKey = `auth:knownip:${user.id}`;
        const seen = await lockoutRedis.sismember(ipKey, ctx.ip);
        if (seen === 0) {
          await lockoutRedis.sadd(ipKey, ctx.ip);
          await lockoutRedis.expire(ipKey, 90 * 24 * 3600);
          // 첫 가입 직후도 "새 IP"라 알림이 한 번 옴 — 정상(가입 안내 같이 가도 무해)
          await this.prisma.notification.create({
            data: {
              userId: user.id,
              type: 'security.new_ip_login',
              dedupeKey: `newip:${user.id}:${ctx.ip}`,
              title: '새 위치에서 로그인됐어요',
              body: `이 로그인이 본인이 아니라면 즉시 비밀번호를 변경해주세요. (IP ${ctx.ip}${ctx.ua ? ' · ' + ctx.ua.slice(0, 60) : ''})`,
              payload: { ip: ctx.ip, ua: ctx.ua || null } as object,
            },
          }).catch(() => null);
          await this.prisma.auditLog.create({
            data: {
              actorId: user.id,
              action: 'auth.login.new_ip',
              summary: `새 IP 로그인: ${ctx.ip}`,
              reason: ctx.ua ? ctx.ua.slice(0, 200) : null,
            },
          }).catch(() => null);
        }
      } catch (e) { /* silent — 알림 실패가 로그인 막지 않음 */ }
    }

    const tokens = await this.issueTokens(user);
    const nextPath = user.role === 'teacher' ? '/teacher/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return { ...tokens, user: this.toUserDto(user), nextPath };
  }

  /**
   * 비밀번호 변경 — 현재 비번 검증 + 새 비번 저장 + **모든 refresh 토큰 일괄 폐기**.
   * 보안 핵심: 비번 바꿔도 기존 다른 기기/세션이 그대로 유효하면 의미 없음.
   */
  async changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    const ok = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!ok) throw new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, '현재 비밀번호가 일치하지 않아요.');
    if (input.newPassword === input.currentPassword) {
      throw new AppError(ErrorCode.VALIDATION_FAILED, '새 비밀번호는 현재와 달라야 해요.');
    }
    const newHash = await bcrypt.hash(input.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
    // 모든 refresh 토큰 폐기 — 다른 기기에서 자동 로그아웃됨
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    // 잠금 카운터도 초기화 (혹시 누적돼 있었을 수 있음)
    try { await lockoutRedis.del(lockoutKey(user.email)); } catch (e) { /* silent */ }
    return { ok: true };
  }

  /**
   * 계정 삭제 (개인정보 보호법 — 정보주체의 삭제권).
   * 비번 재확인 후 user 삭제 → schema의 onDelete:Cascade로 모든 개인 데이터 함께 삭제
   * (refresh/grades/sessions/messages/targets/calendar/notifications/audit-logs).
   * 학교/학급 공통 데이터는 제외(다른 사람의 데이터).
   */
  async deleteAccount(userId: string, currentPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) throw new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, '비밀번호가 일치하지 않아요. 안전을 위해 한 번 더 확인해주세요.');
    // 교사 계정 삭제 시 학급 학생들이 고아가 되지 않게 — 같은 학급 학생이 있으면 막음
    if (user.role === 'teacher' && user.school && user.classroom) {
      const studentsInClass = await this.prisma.user.count({
        where: { role: 'student', school: user.school, classroom: user.classroom },
      });
      if (studentsInClass > 0) {
        throw new AppError(ErrorCode.CONFLICT, `담당 학급에 학생 ${studentsInClass}명이 있어요. 학교에 후임 교사 인계 후 다시 시도해주세요.`);
      }
    }
    await this.prisma.user.delete({ where: { id: userId } });
    logger.info({ userId, role: user.role }, 'account deleted (self-service)');
    return { ok: true };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: { sub: string; typ?: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, { secret: env().JWT_SECRET });
    } catch (e) {
      throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.', { cause: e });
    }
    if (payload.typ !== 'refresh') throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    const row = await this.prisma.refreshToken.findUnique({ where: { tokenHash: sha256(refreshToken) } });
    if (!row) {
      throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    }
    // 🚨 탈취 감지 — 이미 회전돼 revoked 된 토큰을 다시 쓰려는 경우:
    // 정상 흐름이면 절대 발생하지 않음. 발생했다는 건 누군가(공격자) 같은 family 토큰을 가지고 재사용 시도한 것.
    // → 같은 family 전체 폐기(공격자도, 정상 사용자도 모두 로그아웃 → 사용자가 재로그인하면 새 family).
    if (row.revokedAt) {
      if (row.familyId) {
        await this.prisma.refreshToken.updateMany({
          where: { familyId: row.familyId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        logger.warn({ userId: row.userId, familyId: row.familyId }, 'refresh token reuse detected — family revoked');
      }
      throw new AppError(ErrorCode.AUTH_EXPIRED, '보안을 위해 세션이 종료됐어요. 다시 로그인해주세요.');
    }
    if (row.expiresAt < new Date()) {
      throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== 'active') throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    // rotation — 기존 토큰 폐기 후 같은 family로 새 토큰 발급(체인 유지)
    await this.prisma.refreshToken.update({ where: { id: row.id }, data: { revokedAt: new Date() } });
    return this.issueTokens(user, { familyId: row.familyId ?? row.id, parentId: row.id });
  }

  async logout(userId: string): Promise<{ ok: true }> {
    await this.prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
    return { ok: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    return this.toUserDto(user);
  }

  private async issueTokens(user: User, chain?: { familyId: string; parentId: string }): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role, email: user.email, name: user.name },
      { secret: env().JWT_SECRET, expiresIn: env().JWT_ACCESS_TTL_SEC },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, typ: 'refresh', jti: randomUUID() },
      { secret: env().JWT_SECRET, expiresIn: env().JWT_REFRESH_TTL_SEC },
    );
    const created = await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + env().JWT_REFRESH_TTL_SEC * 1000),
        familyId: chain?.familyId, // chain 있으면 같은 family 유지, 없으면 신규 family (아래에서 채움)
        parentId: chain?.parentId,
      },
    });
    // 신규 로그인 — chain 없으면 familyId를 자기 id로 자가 설정 (자기가 family의 시작)
    if (!chain) {
      await this.prisma.refreshToken.update({ where: { id: created.id }, data: { familyId: created.id } });
    }
    return { accessToken, refreshToken };
  }

  private toUserDto(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      school: user.school,
      classroom: user.classroom,
      grade: user.grade,
      tourCompleted: user.tourCompleted,
      status: user.status,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
