import { Injectable } from '@angular/core';
import { Environment } from './environment';

@Injectable()
export class ConfigService {
  get backEndUrl(): string {
    return Environment.backendUrl;
  }

  get discordLoginUrl(): string {
    return Environment.discordLoginUrl;
  }
}
