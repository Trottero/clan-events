import { ClanRole } from 'src/auth/clan.role';

export interface AddClanMemberRequest {
  discordId: number;
  clanRole: ClanRole;
}
