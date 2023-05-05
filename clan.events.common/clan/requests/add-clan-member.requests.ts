export interface AddClanMemberRequest {
  discordId: number;
  clanRole: 'owner' | 'admin' | 'member';
}
