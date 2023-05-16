export interface JwtRefreshTokenContent {
  sub: string;
  discordRefreshToken: string;
  expiresIn: number;
  iat?: number;
}
