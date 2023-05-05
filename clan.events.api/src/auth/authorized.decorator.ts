import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiTokenGuard } from './guards/api-token.guard';
import { RoleInClanGuard } from './guards/role-in-clan.guard';
import { ClanContextGuard } from './guards/clan-context.guard';
import { ClanRole } from '@common/auth/auth.role';

export function HasRoleInClan(...roles: ClanRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(ApiTokenGuard, ClanContextGuard, RoleInClanGuard),
  );
}
