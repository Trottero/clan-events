import { ClanRole } from '@common/auth/clan.role';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UserService } from 'src/user/user.service';

export type RoleInClan = { [clanId: string]: ClanRole };

export class CachedRolesService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  async getRoles(userId: string): Promise<RoleInClan> {
    const cached = await this.cacheManager.get<RoleInClan>(userId);

    if (cached) {
      return cached;
    }

    const user = await this.userService.getUserById(userId);
    const clanRoles = (user.clans ?? []).reduce((acc, membership) => {
      acc[membership.clan as unknown as string] = membership.role;
      return acc;
    }, {});

    await this.setRoles(userId, clanRoles);
    return await this.getRoles(userId);
  }

  async setRoles(userId: string, roles: RoleInClan) {
    return this.cacheManager.set(userId, roles, 0);
  }

  async invalidateCache(userId: string) {
    return this.cacheManager.del(userId);
  }
}
