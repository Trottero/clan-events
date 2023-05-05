import { ClanRole } from 'src/auth/clan.role';

export interface ClanMemberResponse {
  discordId: number;
  clanRole: ClanRole;
}
