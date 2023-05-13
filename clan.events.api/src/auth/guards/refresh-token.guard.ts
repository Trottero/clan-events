import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthConfig } from '../auth.config';
import { JwtRefreshTokenContent } from '@common/auth';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const authConfig = this.configService.get<AuthConfig>('auth');
      const payload = await this.jwtService.verifyAsync<JwtRefreshTokenContent>(
        token,
        {
          secret: authConfig.jwtSecret,
        },
      );

      if (payload.iat + payload.expiresIn < Date.now() / 1000) {
        throw new UnauthorizedException();
      }

      request['refresh_token'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
