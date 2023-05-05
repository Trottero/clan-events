import { Injectable } from '@angular/core';
import { ENVIRONMENT } from './environment';

@Injectable()
export class ConfigService {
  get backEndUrl(): string {
    return ENVIRONMENT.backendUrl;
  }

  get discordLoginUrl(): string {
    return ENVIRONMENT.discordLoginUrl;
  }
}
