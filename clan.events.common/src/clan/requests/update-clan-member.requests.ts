export interface UpdateClanMemberRequest {
  discordId: number;
  clanRole: 'owner' | 'admin' | 'member';
}
