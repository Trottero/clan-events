import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, firstValueFrom } from 'rxjs';
import { DiscordUser } from './models/discord.user';
import { DiscordAuthorizationInfo } from './models/discord.auth.info';

@Injectable()
export class DiscordUserService {
  constructor(private readonly httpClient: HttpService) {}

  async getUserInfo(accessToken: string) {
    const response = this.httpClient
      .get<DiscordUser>('https://discord.com/api/v10/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .pipe(map((resp) => resp.data));

    return firstValueFrom(response);
  }

  async getOAuthInfo(accessToken: string): Promise<DiscordAuthorizationInfo> {
    try {
      const reponse = this.httpClient
        .get<DiscordAuthorizationInfo>(
          'https://discord.com/api/v10/oauth2/@me',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        .pipe(map((resp) => resp.data));
      const a = await firstValueFrom(reponse);
      return a;
    } catch (e) {
      console.log(e);
    }
  }
}
