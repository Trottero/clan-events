export interface AuthConfig {
  jwtSecret: string;
  jwtLifetime: number;
  refreshTokenLifetime: number;
}
