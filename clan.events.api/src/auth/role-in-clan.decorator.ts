import { SetMetadata } from '@nestjs/common';
import { ClanRole } from 'src/database/models/auth.role';

export const ROLES_KEY = 'roles';
export const RoleInClan = (...roles: ClanRole[]) =>
  SetMetadata(ROLES_KEY, roles);
