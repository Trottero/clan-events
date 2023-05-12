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
import { ApiTokenGuard } from './guards/api-token.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  AccessTokenResponse,
  DiscordCodeRedeemRequest,
  JwtRefreshTokenContent,
  JwtTokenContent,
} from '@common/auth';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

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

  @UseGuards(RefreshTokenGuard)
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

  @UseGuards(ApiTokenGuard)
  @Get('me')
  async getUserInfo(@User() user: JwtTokenContent): Promise<JwtTokenContent> {
    return user;
  }
}
