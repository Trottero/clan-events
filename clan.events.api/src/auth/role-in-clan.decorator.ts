import { ClanRole } from '@common/auth/auth.role';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const RoleInClan = (...roles: ClanRole[]) =>
  SetMetadata(ROLES_KEY, roles);
