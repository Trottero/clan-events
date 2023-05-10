import { ClanRole } from '../../auth/clan.role';

export interface UpdateClanMemberRequest {
  discordId: number;
  clanRole: ClanRole;
}
