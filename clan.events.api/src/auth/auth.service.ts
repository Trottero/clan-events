import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface DiscordCodeRedeemRequest {
  client_id: string;
  client_secret: string;
  grant_type: string;
  redirect_uri: string;
  code: string;
}

export interface DiscordTokenRefreshRequest {
  client_id: string;
  client_secret: string;
  refresh_token: string;
  grant_type: string;
}

export interface DiscordAccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly httpClient: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async redeemCode(code: string): Promise<DiscordAccessTokenResponse> {
    const authConfig = this.configService.get<AuthConfig>('auth');
    const body: DiscordCodeRedeemRequest = {
      code: code,
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: authConfig.redirectUri,
    };

    const response = this.httpClient
      .post<DiscordAccessTokenResponse>(
        'https://discord.com/api/v10/oauth2/token',
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map((resp) => resp.data));

    return firstValueFrom(response);
  }

  async refreshCode(refreshToken: string): Promise<DiscordAccessTokenResponse> {
    const authConfig = this.configService.get<AuthConfig>('auth');
    const body: DiscordTokenRefreshRequest = {
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    const response = this.httpClient
      .post<DiscordAccessTokenResponse>(
        'https://discord.com/api/v10/oauth2/token',
        body,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(map((resp) => resp.data));

    return firstValueFrom(response);
  }
}
