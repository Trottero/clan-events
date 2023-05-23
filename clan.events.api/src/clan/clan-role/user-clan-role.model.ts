import { JwtTokenContent } from '@common/auth';
import { ClanRole } from '@common/auth/clan.role';

export interface UserClanRole extends JwtTokenContent {
  clanRole: ClanRole;
}
