import { ClanRole } from '../../database/models/auth.role';

export interface ClanPermissions {
  name: string;
  role: ClanRole;
}
