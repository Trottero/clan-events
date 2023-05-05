import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ApiTokenGuard } from './guards/api-token.guard';
import { User } from 'src/common/decorators/user.decorator';
import {
  AccessTokenResponse,
  DiscordCodeRedeemRequest,
  JwtTokenContent,
} from '@common/auth';

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

  @UseGuards(ApiTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(
    @User() user: JwtTokenContent,
  ): Promise<AccessTokenResponse> {
    try {
      const token = await this.authService.refreshCode(
        user.discordRefreshToken,
      );
      return { token };
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
