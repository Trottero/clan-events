export interface Environment {
  backendUrl: string;
  discordLoginUrl: string;
  production: boolean;
}

export const ENVIRONMENT: Environment = {
  backendUrl: 'http://localhost:3000/api',
  discordLoginUrl:
    // eslint-disable-next-line max-len
    'https://discord.com/api/oauth2/authorize?client_id=1103058475916992584&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fcode&response_type=code&scope=identify',
  production: false,
};
