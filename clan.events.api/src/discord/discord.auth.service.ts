import { Injectable, Logger } from '@nestjs/common';
import { DiscordConfig } from './discord.config';
import { DiscordAccessTokenResponse } from './models/discord.token.response';
import { ConfigService } from '@nestjs/config';
import { DiscordCodeRedeemRequest } from './models/discord.code.redeem.request';
import { HttpService } from '@nestjs/axios';
import { map, firstValueFrom } from 'rxjs';
import { DiscordTokenRefreshRequest } from './models/discord.token.refresh.request';

@Injectable()
export class DiscordAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpClient: HttpService,
  ) {}

  private readonly logger = new Logger(DiscordAuthService.name);

  async redeemCode(code: string): Promise<DiscordAccessTokenResponse> {
    const discordConfig = this.configService.get<DiscordConfig>('discord');
    const body: DiscordCodeRedeemRequest = {
      code: code,
      client_id: discordConfig.clientId,
      client_secret: discordConfig.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: discordConfig.redirectUri,
    };

    const response$ = this.httpClient
      .post<DiscordAccessTokenResponse>(
        `${discordConfig.discordApiUrl}/oauth2/token`,
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map((resp) => resp.data));
    return await firstValueFrom(response$);
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<DiscordAccessTokenResponse> {
    const discordConfig = this.configService.get<DiscordConfig>('discord');
    const body: DiscordTokenRefreshRequest = {
      client_id: discordConfig.clientId,
      client_secret: discordConfig.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    const response$ = this.httpClient
      .post<DiscordAccessTokenResponse>(
        `${discordConfig.discordApiUrl}/oauth2/token`,
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map((resp) => resp.data));
    return await firstValueFrom(response$);
  }
}
