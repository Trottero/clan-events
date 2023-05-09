import { JwtTokenContent } from '@common/auth';
import { ClanRole } from '@common/auth/clan.role';

export interface UserClanContext extends JwtTokenContent {
  clanRole: ClanRole;
}
