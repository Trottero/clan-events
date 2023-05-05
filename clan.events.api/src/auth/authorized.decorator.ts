import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ClanRole } from 'src/database/models/auth.role';
import { ApiTokenGuard } from './guards/api-token.guard';
import { RoleInClanGuard } from './guards/role-in-clan.guard';
import { ClanContextGuard } from './guards/clan-context.guard';

export function HasRoleInClan(...roles: ClanRole[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(ApiTokenGuard, ClanContextGuard, RoleInClanGuard),
  );
}
