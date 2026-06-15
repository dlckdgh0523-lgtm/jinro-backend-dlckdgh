import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AppError, ErrorCode } from '../common/errors';
import { env } from '../common/env';

export interface AuthUser {
  id: string;
  role: 'student' | 'teacher' | 'admin';
  email: string;
  name: string;
}

export interface AuthedRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthedRequest>();
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : (req.query['access_token'] as string | undefined);
    // access_token 쿼리 폴백은 EventSource(헤더 불가) SSE 연결용
    if (!token) {
      throw new AppError(ErrorCode.AUTH_EXPIRED, '로그인이 필요해요.');
    }
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; role: AuthUser['role']; email: string; name: string; typ?: string }>(token, {
        secret: env().JWT_SECRET,
      });
      if (payload.typ === 'refresh') throw new Error('refresh token used as access');
      req.user = { id: payload.sub, role: payload.role, email: payload.email, name: payload.name };
      return true;
    } catch (e) {
      if (e instanceof AppError) throw e;
      throw new AppError(ErrorCode.AUTH_EXPIRED, '세션이 만료됐어요. 다시 로그인해주세요.', { cause: e });
    }
  }
}
