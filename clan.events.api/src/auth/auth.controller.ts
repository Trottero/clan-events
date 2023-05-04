import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  DiscordCodeRedeemRequest,
  AccessTokenResponse,
} from './models/auth.requests';
import { AuthGuard } from './auth.guard';
import { JwtTokenContent } from './models/jwt.token';

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
      const token = await this.authService.redeemDiscordCode(request.code);
      return { token };
    } catch (ex) {
      console.error(ex);
      throw new HttpException('Unauthorized', 401);
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Request() req): Promise<AccessTokenResponse> {
    try {
      const jwt = req['user'] as JwtTokenContent;
      const token = await this.authService.refreshCode(jwt.discordRefreshToken);
      return { token };
    } catch (ex) {
      console.error(ex);
      throw new HttpException('Unauthorized', 401);
    }
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getUserInfo(@Request() req): Promise<JwtTokenContent> {
    return req['user'];
  }
}
