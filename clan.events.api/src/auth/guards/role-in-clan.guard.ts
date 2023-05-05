import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../role-in-clan.decorator';
import { CachedRolesService } from '../services/cached-roles.service';
import { ClanDocument } from 'src/database/schemas/clan.schema';
import { ClanRole } from '@common/auth/auth.role';
import { JwtTokenContent } from '@common/auth';

@Injectable()
export class RoleInClanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly cachedRolesService: CachedRolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<ClanRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const clanName = request.clan as ClanDocument;
    const token = request.user as JwtTokenContent;
    const roles = await this.cachedRolesService.getRoles(token.sub);
    const roleInClan = roles[clanName.id];
    if (!roleInClan) {
      return false;
    }

    return requiredRoles.some((role) => roleInClan == role);
  }
}
