import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CachedRolesService } from '../services/cached-roles.service';
import { ClanDocument } from 'src/database/schemas/clan.schema';
import { ClanRole } from '@common/auth/clan.role';
import { JwtTokenContent } from '@common/auth';
import { CLAN_ROLES_KEY } from '../decorators/requires-clan-roles.decorator';

@Injectable()
export class UserClanRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cachedRolesService: CachedRolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const clanName = request.clan as ClanDocument;
    const token = request.user as JwtTokenContent;
    const roles = await this.cachedRolesService.getRoles(token.sub);
    const roleInClan = roles[clanName.id];
    request['user']['clanRole'] = roleInClan;

    // Grab the roles from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<ClanRole[]>(
      CLAN_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return !!roleInClan && requiredRoles.some((role) => roleInClan == role);
  }
}
