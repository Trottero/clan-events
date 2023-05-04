import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DiscordUserService } from 'src/discord/discord.user.service';
import { Cache } from 'cache-manager';
import { DiscordAuthorizationInfo } from 'src/discord/models/discord.auth.info';

@Injectable()
export class TokenCacheService {
  constructor(
    private readonly discordUserService: DiscordUserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getTokenInfo(
    accessToken: string,
  ): Promise<DiscordAuthorizationInfo> {
    const info = await this.cacheManager.get<DiscordAuthorizationInfo>(
      accessToken,
    );

    if (info) {
      return info;
    }

    const discordTokenInfo = await this.discordUserService.getTokenInfo(
      accessToken,
    );
    await this.updateCache(accessToken, discordTokenInfo);
    return discordTokenInfo;
  }

  private async updateCache(
    accessToken: string,
    info: DiscordAuthorizationInfo,
  ) {
    const expiryDate = new Date(info.expires);
    const timeToLive = expiryDate.getTime() - Date.now();
    await this.cacheManager.set(accessToken, info, timeToLive);
  }
}
