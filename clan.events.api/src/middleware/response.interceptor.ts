import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'clan.events.common/src/responses';

const SANITIZED_ROUTE_PARAM = '[a-zA-Z0-9 -]+';

const IGNORED_ROUTES = [
  `/${SANITIZED_ROUTE_PARAM}/events/${SANITIZED_ROUTE_PARAM}/background`,
];

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Intercepts the incoming request and outgoing response.
   * If the request URL matches an ignored route, the request is passed through without modification.
   * Otherwise, the response is wrapped in an object containing additional metadata.
   * @param context The execution context.
   * @param next The next call handler.
   * @returns An observable containing the modified response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const url = context.switchToHttp().getRequest().url.toLowerCase();
    const match = IGNORED_ROUTES.some((route) => url.match(route));

    if (match) {
      return next.handle();
    }

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
