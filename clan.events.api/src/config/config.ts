import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';
const configPath = join(process.cwd(), YAML_CONFIG_FILENAME);

export interface Configuration {
  database: DatabaseConfiguration;
  auth: AuthConfiguration;
}

export interface DatabaseConfiguration {
  uri: string;
  key?: string;
}

export interface AuthConfiguration {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export default (): Configuration => {
  return yaml.load(readFileSync(configPath, 'utf8')) as Configuration;
};
