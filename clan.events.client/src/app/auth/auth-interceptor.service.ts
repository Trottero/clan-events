import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private readonly authService: AuthService) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.authState$.pipe(
      switchMap(authState => {
        if (request.url.includes('auth/refresh')) {
          if (authState.refreshToken) {
            // eslint-disable-next-line no-param-reassign
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${authState.refreshToken}`,
              },
            });
          }
        } else if (authState.accessToken) {
          // eslint-disable-next-line no-param-reassign
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authState.accessToken}`,
            },
          });
        }

        return next.handle(request);
      })
    );
  }
}
