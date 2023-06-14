import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { AuthConfig } from 'src/auth/auth.config';
import { DatabaseConfig } from 'src/database/database.config';
import { DiscordConfig } from 'src/discord/discord.config';

const YAML_CONFIG_FILENAME = 'config.yaml';
const configPath = join(process.cwd(), YAML_CONFIG_FILENAME);

export interface AppConfig {
  database: DatabaseConfig;
  discord: DiscordConfig;
  auth: AuthConfig;
}

export default (): AppConfig => {
  // Load from environment
  if (process.env.PRODUCTION) {
    console.log('Loading config from environment variables');
    return {
      database: {
        uri: process.env.MONGODB_URI,
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        redirectUri: process.env.DISCORD_REDIRECT_URI,
        discordApiUrl: process.env.DISCORD_API_URL,
      },
      auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtLifetime: 3600,
        refreshTokenLifetime: 604800,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
      },
    };
  }

  return yaml.load(readFileSync(configPath, 'utf8')) as AppConfig;
};
