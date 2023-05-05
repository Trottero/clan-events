export interface JwtTokenContent {
  username: string;
  sub: string;
  discordId: number;
  discordToken: string;
  discordRefreshToken: string;
  expiresIn: number;
  iat?: number;
}
