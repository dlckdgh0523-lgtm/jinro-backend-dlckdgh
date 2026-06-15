import { Body, Controller, Get, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { JwtAuthGuard, type AuthedRequest } from './jwt.guard';
import { parseOrThrow } from '../common/zod';
import { AppError, ErrorCode } from '../common/errors';

const consentsSchema = z.object({
  tos: z.boolean(),
  privacy: z.boolean(),
  academic: z.boolean(),
  ai: z.boolean(),
  age: z.boolean(),
  mkt: z.boolean().optional(),
});

const emailSchema = z.string().trim().email('이메일 형식이 올바르지 않아요').max(254);
const passwordSchema = z.string().min(8, '비밀번호는 8자 이상이어야 해요').max(128);
const nameSchema = z.string().trim().min(1).max(50);

const signupStudentSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  inviteCode: z.string().trim().max(20).optional(),
  grade: z.enum(['E4', 'E5', 'E6', 'M1', 'M2', 'M3', 'H1', 'H2', 'H3']).optional(),
  consents: consentsSchema,
});

const signupTeacherSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  school: z.string().trim().min(1).max(100),
  classroom: z.string().trim().min(1).max(100),
  consents: consentsSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
});

const refreshSchema = z.object({ refreshToken: z.string().min(10).max(4096) });

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('signup/student')
  @HttpCode(201)
  signupStudent(@Body() body: unknown) {
    return this.auth.signupStudent(parseOrThrow(signupStudentSchema, body));
  }

  @Post('signup/teacher')
  @HttpCode(201)
  signupTeacher(@Body() body: unknown) {
    return this.auth.signupTeacher(parseOrThrow(signupTeacherSchema, body));
  }

  // 로그인 rate limit 5/min/IP (backend-integration.md §1)
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  login(@Body() body: unknown) {
    return this.auth.login(parseOrThrow(loginSchema, body));
  }

  /**
   * 데모 계정 — 사용자가 가입 없이 둘러볼 수 있게.
   * 매번 새 student 사용자 생성(이메일=demo-{ms}@jinro.it.kr) → 발급된 토큰으로 바로 진입.
   * 동의는 자동 처리(데모는 데이터 저장 안 한다는 가정).
   */
  @Post('demo')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async demo() {
    const email = `demo-${Date.now()}-${Math.floor(Math.random() * 1e5)}@jinro.it.kr`;
    return this.auth.signupStudent({
      email,
      password: `demo!${Date.now()}`,
      name: '데모학생',
      grade: 'H1',
      consents: { tos: true, privacy: true, academic: true, ai: true, age: true },
    });
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() body: unknown) {
    const { refreshToken } = parseOrThrow(refreshSchema, body);
    return this.auth.refresh(refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: AuthedRequest) {
    return this.auth.logout(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: AuthedRequest) {
    return this.auth.me(req.user.id);
  }

  // OAuth 온보딩 완료 — 이름/학년/필수동의 입력 반영 (소셜 신규 가입자용)
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Req() req: AuthedRequest, @Body() body: unknown) {
    const schema = z.object({
      name: z.string().trim().min(1).max(50).optional(),
      grade: z.enum(['E4', 'E5', 'E6', 'M1', 'M2', 'M3', 'H1', 'H2', 'H3']).optional(),
      consents: consentsSchema.optional(),
    });
    return this.auth.completeProfile(req.user.id, parseOrThrow(schema, body));
  }

  // 구글/카카오 OAuth는 OAuthController(GET /auth/{provider}/start·/callback)에서 처리.

  // ─── 차기 범위 예약 라우트 (OPEN_QUESTIONS #7) — 501 표준 에러 ───

  @Post('password/forgot')
  passwordForgot(): never {
    throw new AppError(ErrorCode.NOT_IMPLEMENTED, '비밀번호 재설정은 준비 중이에요.');
  }

  @Post('password/verify')
  passwordVerify(): never {
    throw new AppError(ErrorCode.NOT_IMPLEMENTED, '비밀번호 재설정은 준비 중이에요.');
  }

  @Post('password/reset')
  passwordReset(): never {
    throw new AppError(ErrorCode.NOT_IMPLEMENTED, '비밀번호 재설정은 준비 중이에요.');
  }

  @Post('find-id')
  findId(): never {
    throw new AppError(ErrorCode.NOT_IMPLEMENTED, '아이디 찾기는 준비 중이에요.');
  }
}
