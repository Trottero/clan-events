import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { EnsureApiTokenGuard } from './guards/ensure-api-token.guard';
import {
  AccessTokenResponse,
  DiscordCodeRedeemRequest,
  JwtRefreshTokenContent,
  JwtTokenContent,
} from '@common/auth';
import { EnsureRefreshTokenGuard } from './guards/ensure-refresh-token.guard';
import { JwtTokenContentParam } from './decorators/jwt-token-content.param';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('redeem')
  async redeemCode(
    @Body() request: DiscordCodeRedeemRequest,
  ): Promise<AccessTokenResponse> {
    if (!request || !request.code) {
      throw new HttpException('No code provided', 400);
    }

    try {
      return await this.authService.redeemDiscordCode(request.code);
    } catch (ex) {
      console.error(ex);
      throw new HttpException('Unauthorized', 401);
    }
  }

  @UseGuards(EnsureRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Request() req): Promise<AccessTokenResponse> {
    try {
      const refreshToken = req['refresh_token'] as JwtRefreshTokenContent;

      if (!refreshToken) {
        throw new HttpException('Unauthorized', 401);
      }

      return await this.authService.refreshCode(
        refreshToken.discordRefreshToken,
      );
    } catch (ex) {
      console.error(ex);
      throw new HttpException('Unauthorized', 401);
    }
  }

  @UseGuards(EnsureApiTokenGuard)
  @Get('me')
  async getUserInfo(
    @JwtTokenContentParam() user: JwtTokenContent,
  ): Promise<JwtTokenContent> {
    return user;
  }
}
