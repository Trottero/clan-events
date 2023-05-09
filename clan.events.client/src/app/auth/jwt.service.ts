import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { JwtTokenContent } from '@common/auth';

@Injectable()
export class JwtService {
  decodeToken(token: string): JwtTokenContent {
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

  urlBase64Decode(data: string): string {
    return Buffer.from(data, 'base64').toString();
  }
}
