import { Injectable } from '@angular/core';
import { JwtTokenContent } from './jwt.token';
import { Buffer } from 'buffer';

@Injectable()
export class JwtService {
  public decodeToken(token: string): JwtTokenContent {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded) as JwtTokenContent;
  }

  public urlBase64Decode(data: string): string {
    return Buffer.from(data, 'base64').toString();
  }
}
