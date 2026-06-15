import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { PrismaService } from '../db/prisma.service';
import { AppError, ErrorCode } from '../common/errors';
import { env } from '../common/env';
import type { Role, User } from '@prisma/client';

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
    return this.signup({ ...input, role: 'student' });
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
  async oauthLogin(input: { email: string; name: string; provider: 'google' | 'kakao' }): Promise<{ accessToken: string; refreshToken: string; role: Role; isNew: boolean; needsProfile: boolean; name: string }> {
    const email = input.email.trim().toLowerCase();
    let user = await this.prisma.user.findUnique({ where: { email } });
    let isNew = false;
    if (!user) {
      isNew = true;
      user = await this.prisma.user.create({
        data: {
          email,
          passwordHash: await bcrypt.hash(randomUUID(), 10), // 비밀번호 로그인 불가(소셜 전용)
          name: input.name?.trim() || email.split('@')[0],
          role: 'student',
          // 동의/학년은 온보딩에서 받는다 — grade 미설정으로 "온보딩 필요"를 표시
          consents: { oauth: input.provider } as object,
        },
      });
    }
    if (user.status !== 'active') {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, '이용이 제한된 계정이에요. 고객센터에 문의해주세요.');
    }
    const tokens = await this.issueTokens(user);
    const needsProfile = user.role === 'student' && !user.grade; // 학년 없으면 온보딩 필요
    return { ...tokens, role: user.role, isNew, needsProfile, name: user.name };
  }

  // OAuth 온보딩 완료 — 이름/학년/필수동의 입력 반영.
  async completeProfile(userId: string, input: { name?: string; grade?: string; consents?: Consents }) {
    if (input.consents) this.requireConsents(input.consents);
    const data: { name?: string; grade?: string; consents?: object } = {};
    if (input.name?.trim()) data.name = input.name.trim();
    if (input.grade) data.grade = input.grade;
    if (input.consents) data.consents = input.consents as object;
    const user = await this.prisma.user.update({ where: { id: userId }, data });
    return this.toUserDto(user);
  }

  async login(input: { email: string; password: string; role?: Role }) {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, '이메일 또는 비밀번호가 올바르지 않아요.');
    }
    if (user.status !== 'active') {
      throw new AppError(ErrorCode.AUTH_FORBIDDEN, '이용이 제한된 계정이에요. 고객센터에 문의해주세요.');
    }
    if (input.role && user.role !== input.role) {
      throw new AppError(ErrorCode.AUTH_INVALID_CREDENTIALS, '이메일 또는 비밀번호가 올바르지 않아요.');
    }
    const tokens = await this.issueTokens(user);
    const nextPath = user.role === 'teacher' ? '/teacher/dashboard' : user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return { ...tokens, user: this.toUserDto(user), nextPath };
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
    if (!row || row.revokedAt || row.expiresAt < new Date()) {
      throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== 'active') throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.');
    // rotation — 기존 토큰 폐기 후 재발급
    await this.prisma.refreshToken.update({ where: { id: row.id }, data: { revokedAt: new Date() } });
    return this.issueTokens(user);
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

  private async issueTokens(user: User): Promise<TokenPair> {
    const accessToken = await this.jwt.signAsync(
      { sub: user.id, role: user.role, email: user.email, name: user.name },
      { secret: env().JWT_SECRET, expiresIn: env().JWT_ACCESS_TTL_SEC },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: user.id, typ: 'refresh', jti: randomUUID() },
      { secret: env().JWT_SECRET, expiresIn: env().JWT_REFRESH_TTL_SEC },
    );
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(refreshToken),
        expiresAt: new Date(Date.now() + env().JWT_REFRESH_TTL_SEC * 1000),
      },
    });
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
