import { ClanPermissions } from './clan.permissions';

export interface JwtTokenContent {
  username: string;
  sub: number;
  discordToken: string;
  discordRefreshToken: string;
  expiresIn: number;
  permissions: ClanPermissions[];
  iat?: number;
}
