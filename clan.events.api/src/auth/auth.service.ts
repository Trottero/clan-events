import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DiscordAuthService } from 'src/discord/discord.auth.service';
import { DiscordUserService } from 'src/discord/discord.user.service';
import { DiscordAccessTokenResponse } from 'src/discord/models/discord.token.response';
import { JwtTokenContent as JwtTokenPayload } from './models/jwt.token';
import { AuthConfig } from './auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly discordAuthService: DiscordAuthService,
    private readonly discordUserService: DiscordUserService,
    private readonly jwtService: JwtService,
  ) {}

  private logger = new Logger(AuthService.name);

  async redeemDiscordCode(discordCode: string): Promise<string> {
    const discordToken = await this.discordAuthService.redeemCode(discordCode);
    return await this.jwtFromDiscordAccessToken(discordToken);
  }

  async refreshCode(refreshToken: string): Promise<string> {
    const discordToken = await this.discordAuthService.refreshToken(
      refreshToken,
    );
    return await this.jwtFromDiscordAccessToken(discordToken);
  }

  async jwtFromDiscordAccessToken(
    discordToken: DiscordAccessTokenResponse,
  ): Promise<string> {
    const discordUser = await this.discordUserService.getUserInfo(
      discordToken.access_token,
    );
    const discordTokenInfo = await this.discordUserService.getOAuthInfo(
      discordToken.access_token,
    );

    const authConfig = this.configService.get<AuthConfig>('auth');
    const tokenPayload: JwtTokenPayload = {
      username: discordUser.username,
      sub: discordUser.id,
      discordToken: discordToken.access_token,
      discordRefreshToken: discordToken.refresh_token,
      expiresIn: authConfig.jwtLifetime,
      permissions: [],
    };

    const jwt = await this.jwtService.signAsync(tokenPayload);

    return jwt;
  }
}
