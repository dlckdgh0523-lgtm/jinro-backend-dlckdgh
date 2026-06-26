import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { env } from '../common/env';
import { logger } from '../common/logger';

// 소셜 로그인(구글·카카오) — 서버 사이드 code 교환. 키는 env로만 주입.
// 흐름: 프론트 버튼 → /start(302 to provider) → provider → /callback → 토큰 발급 → /legacy 로 토큰 전달(해시).
@Controller('v1/auth')
export class OAuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
  ) {}

  private base(req: Request): string {
    if (env().OAUTH_REDIRECT_BASE) return env().OAUTH_REDIRECT_BASE.replace(/\/$/, '');
    const proto = ((req.headers['x-forwarded-proto'] as string) || '').split(',')[0] || 'http';
    const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost';
    return `${proto}://${host}`;
  }
  private cb(req: Request, provider: string): string {
    return `${this.base(req)}/v1/auth/${provider}/callback`;
  }
  private makeState(provider: string): Promise<string> {
    return this.jwt.signAsync({ typ: 'oauth', p: provider }, { secret: env().JWT_SECRET, expiresIn: 600 });
  }
  private async checkState(state: string | undefined, provider: string): Promise<void> {
    const p = await this.jwt.verifyAsync<{ typ?: string; p?: string }>(state ?? '', { secret: env().JWT_SECRET });
    if (p.typ !== 'oauth' || p.p !== provider) throw new Error('state mismatch');
  }
  private ok(res: Response, t: { accessToken: string; refreshToken: string; role: string; needsProfile?: boolean; name?: string; email?: string }): void {
    const payload = Buffer.from(JSON.stringify({
      accessToken: t.accessToken, refreshToken: t.refreshToken, role: t.role,
      needsProfile: !!t.needsProfile, name: t.name || '', email: t.email || '',
    })).toString('base64url');
    res.redirect(`/legacy/index.html#oauth=${payload}`);
  }
  private fail(res: Response, msg: string): void {
    res.redirect(`/legacy/index.html#oauth_error=${encodeURIComponent(msg)}`);
  }

  // ─── Google ───
  @Get('google/start')
  async googleStart(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (!env().GOOGLE_CLIENT_ID) return this.fail(res, 'Google 로그인이 아직 설정되지 않았어요.');
    const state = await this.makeState('google');
    const url = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
      client_id: env().GOOGLE_CLIENT_ID,
      redirect_uri: this.cb(req, 'google'),
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
      access_type: 'online',
    }).toString();
    res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response, @Query('code') code?: string, @Query('state') state?: string, @Query('error') error?: string): Promise<void> {
    if (error || !code) return this.fail(res, '구글 로그인이 취소됐어요.');
    try {
      await this.checkState(state, 'google');
      const tokRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code, client_id: env().GOOGLE_CLIENT_ID, client_secret: env().GOOGLE_CLIENT_SECRET,
          redirect_uri: this.cb(req, 'google'), grant_type: 'authorization_code',
        }).toString(),
      });
      const tok = (await tokRes.json()) as { id_token?: string };
      if (!tok.id_token) throw new Error('no id_token');
      const claims = JSON.parse(Buffer.from(tok.id_token.split('.')[1], 'base64url').toString('utf8')) as { email?: string; name?: string; email_verified?: boolean };
      if (!claims.email) throw new Error('no email in id_token');
      const result = await this.auth.oauthLogin({ email: claims.email, name: claims.name || '', provider: 'google' });
      this.ok(res, result);
    } catch (e) {
      logger.warn({ err: (e as Error).message }, 'google oauth failed');
      this.fail(res, '구글 로그인에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  }

  // ─── Kakao ───
  @Get('kakao/start')
  async kakaoStart(@Req() req: Request, @Res() res: Response): Promise<void> {
    if (!env().KAKAO_REST_API_KEY) return this.fail(res, '카카오 로그인이 아직 설정되지 않았어요.');
    const state = await this.makeState('kakao');
    const url = 'https://kauth.kakao.com/oauth/authorize?' + new URLSearchParams({
      client_id: env().KAKAO_REST_API_KEY,
      redirect_uri: this.cb(req, 'kakao'),
      response_type: 'code',
      state,
      scope: 'account_email profile_nickname',
    }).toString();
    res.redirect(url);
  }

  @Get('kakao/callback')
  async kakaoCallback(@Req() req: Request, @Res() res: Response, @Query('code') code?: string, @Query('state') state?: string, @Query('error') error?: string): Promise<void> {
    if (error || !code) return this.fail(res, '카카오 로그인이 취소됐어요.');
    try {
      await this.checkState(state, 'kakao');
      const tokRes = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code', client_id: env().KAKAO_REST_API_KEY,
          redirect_uri: this.cb(req, 'kakao'), code,
          ...(env().KAKAO_CLIENT_SECRET ? { client_secret: env().KAKAO_CLIENT_SECRET } : {}),
        }).toString(),
      });
      const tok = (await tokRes.json()) as { access_token?: string };
      if (!tok.access_token) throw new Error('no access_token');
      const meRes = await fetch('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${tok.access_token}` } });
      const me = (await meRes.json()) as { kakao_account?: { email?: string; profile?: { nickname?: string } }; properties?: { nickname?: string } };
      const email = me.kakao_account?.email;
      const name = me.kakao_account?.profile?.nickname || me.properties?.nickname || '카카오사용자';
      if (!email) throw new Error('no email (이메일 동의 필요)');
      const result = await this.auth.oauthLogin({ email, name, provider: 'kakao' });
      this.ok(res, result);
    } catch (e) {
      logger.warn({ err: (e as Error).message }, 'kakao oauth failed');
      this.fail(res, '카카오 로그인에 실패했어요. (카카오 이메일 제공 동의가 필요할 수 있어요)');
    }
  }
}
