import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, firstValueFrom } from 'rxjs';
import { DiscordUser } from './models/discord.user';

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
}
