import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { JwtRefreshTokenContent, JwtTokenContent } from '@common/auth';

@Injectable()
export class JwtService {
  decodeToken<T = JwtTokenContent | JwtRefreshTokenContent>(token: string): T {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded) as T;
  }

  urlBase64Decode(data: string): string {
    return Buffer.from(data, 'base64').toString();
  }
}
