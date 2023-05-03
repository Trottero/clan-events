export interface AuthState {
  accessToken: Token;
  refreshToken: Token;
  // expires_at is a timestamp in milliseconds at which the current access_token expires
}

export interface Token {
  token: string;
  expiresAt: number;
}
