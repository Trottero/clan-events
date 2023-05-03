export interface AuthState {
  access_token: Token;
  refresh_token: Token;
  // expires_at is a timestamp in milliseconds at which the current access_token expires
}

export interface Token {
  token: string;
  expires_at: number;
}
