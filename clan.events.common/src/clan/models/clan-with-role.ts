import { ClanRole } from '../../auth/clan.role';
import { Clan } from './clan';

export interface ClanWithRole extends Clan {
  role: ClanRole;
}
