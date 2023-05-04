import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CodeRedeemRequest, CodeRedeemResponse } from './models/auth.requests';
import { DiscordUserService } from 'src/discord/discord.user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly discordUserService: DiscordUserService,
  ) {}

  @Post('redeem')
  async redeemCode(
    @Body() request: CodeRedeemRequest,
  ): Promise<CodeRedeemResponse> {
    if (!request || !request.code) {
      throw new HttpException('No code provided', 400);
    }

    try {
      const token = await this.authService.redeemCode(request.code);
      const user = await this.discordUserService.getUserInfo(
        token.access_token,
      );
      return { ...token, user };
    } catch (ex) {
      console.error(ex);
    }
  }

  @Post('refresh')
  async refreshCode(
    @Body() request: CodeRedeemRequest,
  ): Promise<CodeRedeemResponse> {
    if (!request || !request.code) {
      throw new HttpException('No refresh token provided', 400);
    }

    try {
      const token = await this.authService.redeemCode(request.code);
      const user = await this.discordUserService.getUserInfo(
        token.access_token,
      );
      return { ...token, user };
    } catch (ex) {
      console.error(ex);
    }
  }
}
