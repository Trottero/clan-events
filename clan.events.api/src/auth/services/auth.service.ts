import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DiscordAuthService } from 'src/discord/discord.auth.service';
import { DiscordUserService } from 'src/discord/discord.user.service';
import { DiscordAccessTokenResponse } from 'src/discord/models/discord.token.response';
import { AuthConfig } from '../auth.config';
import { UserService } from 'src/user/user.service';
import {
  AccessTokenResponse,
  JwtRefreshTokenContent,
  JwtTokenContent,
} from '@common/auth';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly discordAuthService: DiscordAuthService,
    private readonly discordUserService: DiscordUserService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private logger = new Logger(AuthService.name);

  async redeemDiscordCode(discordCode: string): Promise<AccessTokenResponse> {
    const discordToken = await this.discordAuthService.redeemCode(discordCode);
    return await this.jwtFromDiscordAccessToken(discordToken);
  }

  async refreshCode(refreshToken: string): Promise<AccessTokenResponse> {
    const discordToken = await this.discordAuthService.refreshToken(
      refreshToken,
    );
    return await this.jwtFromDiscordAccessToken(discordToken);
  }

  async jwtFromDiscordAccessToken(
    discordToken: DiscordAccessTokenResponse,
  ): Promise<AccessTokenResponse> {
    const discordUser = await this.discordUserService.getUserInfo(
      discordToken.access_token,
    );
    const discordTokenInfo = await this.discordUserService.getOAuthInfo(
      discordToken.access_token,
    );

    const databaseUser = await this.userService.getOrCreateUser(
      discordUser.id,
      discordUser.username,
    );

    const authConfig = this.configService.get<AuthConfig>('auth');
    const tokenPayload: JwtTokenContent = {
      username: discordUser.username,
      sub: databaseUser.id,
      discordToken: discordToken.access_token,
      discordRefreshToken: discordToken.refresh_token,
      expiresIn: authConfig.jwtLifetime,
      discordId: Number(discordUser.id),
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload);

    const refreshTokenPayload: JwtRefreshTokenContent = {
      sub: databaseUser.id,
      discordRefreshToken: discordToken.refresh_token,
      expiresIn: authConfig.refreshTokenLifetime,
    };

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: authConfig.refreshTokenSecret,
    });

    return {
      token: accessToken,
      refreshToken: refreshToken,
    };
  }
}
