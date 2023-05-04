import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { AuthConfig } from 'src/auth/auth.config';
import { DatabaseConfig } from 'src/database/database.config';

const YAML_CONFIG_FILENAME = 'config.yaml';
const configPath = join(process.cwd(), YAML_CONFIG_FILENAME);

export interface AppConfig {
  database: DatabaseConfig;
  auth: AuthConfig;
}

export default (): AppConfig => {
  return yaml.load(readFileSync(configPath, 'utf8')) as AppConfig;
};
