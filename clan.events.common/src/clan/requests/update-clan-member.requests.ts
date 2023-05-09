import { ClanRole } from 'src/auth/clan.role';

export interface UpdateClanMemberRequest {
  discordId: number;
  clanRole: ClanRole;
}
