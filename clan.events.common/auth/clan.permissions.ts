import { ClanRole } from '../../clan.events.api/src/database/models/auth.role';

export interface ClanPermissions {
  name: string;
  role: ClanRole;
}
