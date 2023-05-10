import { ClanRole } from '../../auth/clan.role';

export interface ClanMemberResponse {
  discordId: number;
  name: string;
  clanRole: ClanRole;
}
