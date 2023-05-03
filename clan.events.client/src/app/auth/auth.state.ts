export interface AuthState {
  access_token: string;
  token_type: string;

  // expires_at is a timestamp in milliseconds at which the current access_token expires
  expires_at: number;
  refresh_token: string;
}
