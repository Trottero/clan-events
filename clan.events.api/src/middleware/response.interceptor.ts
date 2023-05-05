// Simple response middleware for nestjs

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'clan.events.common/src/responses';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      map((response: Response<unknown>) => {
        return {
          data: response,
          timestamp: Date.now(),
          executionTime: Date.now() - now,
        };
      }),
    );
  }
}
