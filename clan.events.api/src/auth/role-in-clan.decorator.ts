import { ClanRole } from '@common/auth/clan.role';
import { SetMetadata } from '@nestjs/common';

export const CLAN_ROLES_KEY = 'clan_roles';
export const RoleInClan = (...roles: ClanRole[]) =>
  SetMetadata(CLAN_ROLES_KEY, roles);
