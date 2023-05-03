import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

export interface DiscordCodeRedeemRequest extends AuthConfig {
  code: string;
}

export interface DiscordCodeRedeemResponse {
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

  async redeemCode(code: string): Promise<DiscordCodeRedeemResponse> {
    const authConfig = this.configService.get<AuthConfig>('auth');
    const body: DiscordCodeRedeemRequest = { ...authConfig, code: code };

    const response = this.httpClient
      .post<DiscordCodeRedeemResponse>(
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

  async refreshCode(refreshToken: string): Promise<DiscordCodeRedeemResponse> {
    const authConfig = this.configService.get<AuthConfig>('auth');
    const body = {
      ...authConfig,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    const response = this.httpClient
      .post<DiscordCodeRedeemResponse>(
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
