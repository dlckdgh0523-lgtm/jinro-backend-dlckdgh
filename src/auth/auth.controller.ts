import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Req, UseGuards } from '@nestjs/common';
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

// 입력 검증 강화 — 이름/학교/학급에 정규식 추가. XSS·SQL injection·이상 입력 1차 방어.
// 한글(가-힣)·영문·숫자·공백·일부 기호만 허용. 컨트롤 문자·HTML 태그·SQL 메타문자 차단.
// (DB·표시 시점에는 별도 escape 있지만, 입력 시점에 거르는 게 정직한 데이터 보장).
const emailSchema = z.string().trim().email('이메일 형식이 올바르지 않아요').max(254);
const passwordSchema = z.string().min(8, '비밀번호는 8자 이상이어야 해요').max(128);
// 이름 — 한글 자모 포함 (외국인 학생 대비 알파벳·공백·점·하이픈 허용)
const nameSchema = z.string().trim().min(1).max(50)
  .regex(/^[\p{L}\p{M}0-9 .\-_'·]+$/u, '이름에 사용할 수 없는 문자가 포함돼 있어요');
// 학교명 — 한글·영문·숫자·공백·일부 기호
const schoolSchema = z.string().trim().min(1).max(100)
  .regex(/^[\p{L}\p{M}0-9 .\-_()·]+$/u, '학교명에 사용할 수 없는 문자가 포함돼 있어요');
// 학급명 — "1-3", "3반", "1학년 2반" 같이 자유로움. 짧고 한글·숫자·공백·하이픈만.
const classroomSchema = z.string().trim().min(1).max(30)
  .regex(/^[\p{L}\p{M}0-9 \-]+$/u, '학급명에 사용할 수 없는 문자가 포함돼 있어요');
// 초대코드 — 영숫자 6~20자만 (대시 허용)
const inviteCodeSchema = z.string().trim().max(20)
  .regex(/^[A-Za-z0-9-]*$/, '초대코드는 영문/숫자만 입력해주세요').optional();

const signupStudentSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  inviteCode: inviteCodeSchema,
  grade: z.enum(['E4', 'E5', 'E6', 'M1', 'M2', 'M3', 'H1', 'H2', 'H3']).optional(),
  consents: consentsSchema,
});

const signupTeacherSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  school: schoolSchema,
  classroom: classroomSchema,
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
  login(@Body() body: unknown, @Req() req: AuthedRequest) {
    // 의심 IP 알림 — 새 IP/UA에서 로그인 시 본인에게 알림. 본인이면 무시, 본인이 아니면 즉시 비번 변경 유도.
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || (req as unknown as { ip?: string }).ip || '';
    const ua = (req.headers['user-agent'] as string) || '';
    return this.auth.login(parseOrThrow(loginSchema, body), { ip, ua });
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
      tourCompleted: z.boolean().optional(),
    });
    return this.auth.completeProfile(req.user.id, parseOrThrow(schema, body));
  }

  // 둘러보기 완료/재시작 토글 — 사용자 단위 flag (브라우저 무관, 어디서 로그인해도 한 번만 노출).
  @Post('tour/complete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  tourComplete(@Req() req: AuthedRequest, @Body() body: unknown) {
    const { completed } = parseOrThrow(z.object({ completed: z.boolean().default(true) }), body ?? {});
    return this.auth.completeProfile(req.user.id, { tourCompleted: completed });
  }

  // 구글/카카오 OAuth는 OAuthController(GET /auth/{provider}/start·/callback)에서 처리.

  // ─── 차기 범위 예약 라우트 (OPEN_QUESTIONS #7) — 501 표준 에러 ───

  // 비밀번호 변경 — 현재 비번 검증 + 새 비번 저장 + 모든 refresh 토큰 일괄 폐기(보안)
  @Patch('password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  changePassword(@Req() req: AuthedRequest, @Body() body: unknown) {
    const schema = z.object({
      currentPassword: z.string().min(1).max(128),
      newPassword: passwordSchema,
    });
    return this.auth.changePassword(req.user.id, parseOrThrow(schema, body));
  }

  // 계정 삭제권 (정보주체의 삭제권) — 비번 재확인 후 모든 개인 데이터 함께 삭제
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  deleteMe(@Req() req: AuthedRequest, @Body() body: unknown) {
    const { currentPassword } = parseOrThrow(z.object({ currentPassword: z.string().min(1).max(128) }), body);
    return this.auth.deleteAccount(req.user.id, currentPassword);
  }

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
