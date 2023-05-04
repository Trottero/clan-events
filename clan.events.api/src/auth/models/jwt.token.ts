export interface JwtTokenContent {
  username: string;
  sub: string;
  discordToken: string;
  discordRefreshToken: string;
  expiresIn: number;
}
