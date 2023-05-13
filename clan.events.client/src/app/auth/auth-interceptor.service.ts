import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.authState$.pipe(
      take(1),
      switchMap(authState => {
        if (request.url.includes('auth/refresh') && authState.refreshToken) {
          const copy = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authState.refreshToken}`,
            },
          });
          return next.handle(copy);
        }
        if (authState.accessToken) {
          const copy = request.clone({
            setHeaders: {
              Authorization: `Bearer ${authState.accessToken}`,
            },
          });
          return next.handle(copy);
        }

        return next.handle(request);
      })
    );
  }
}
