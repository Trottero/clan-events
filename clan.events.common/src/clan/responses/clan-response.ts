import { ClanMemberResponse } from './clan-member.response';

export interface ClanResponse {
  name: string;
  displayName: string;
  members: ClanMemberResponse[];
}
