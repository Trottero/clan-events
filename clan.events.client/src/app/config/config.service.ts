import { Injectable } from '@angular/core';
import { ENVIRONMENT } from './environment';

@Injectable()
export class ConfigService {
  public get backEndUrl(): string {
    return ENVIRONMENT.backendUrl;
  }

  public get discordLoginUrl(): string {
    return ENVIRONMENT.discordLoginUrl;
  }
}
