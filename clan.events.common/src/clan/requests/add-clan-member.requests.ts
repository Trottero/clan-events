import { ClanRole } from '../../auth/clan.role';

export interface AddClanMemberRequest {
  discordId: number;
  clanRole: ClanRole;
}
