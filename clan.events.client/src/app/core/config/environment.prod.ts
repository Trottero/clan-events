import { Environment } from './environment.model';

export const ENVIRONMENT: Environment = {
  backendUrl: 'https://clan-events-api.azurewebsites.net/api',
  discordLoginUrl:
    // eslint-disable-next-line max-len
    'https://discord.com/api/oauth2/authorize?client_id=1103058475916992584&redirect_uri=https%3A%2F%2Fmango-cliff-08099bf03.3.azurestaticapps.net%2Fcode&response_type=code&scope=identify',
  production: true,
};
