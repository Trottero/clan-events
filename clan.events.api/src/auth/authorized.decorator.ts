import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiTokenGuard } from './guards/api-token.guard';
import { RoleInClanGuard } from './guards/role-in-clan.guard';
import { ClanContextGuard } from './guards/clan-context.guard';
import { ClanRole } from '@common/auth/clan.role';

export function HasRoleInClan(...roles: ClanRole[]) {
  return applyDecorators(
    SetMetadata('clan_roles', roles),
    UseGuards(ApiTokenGuard, ClanContextGuard, RoleInClanGuard),
  );
}
