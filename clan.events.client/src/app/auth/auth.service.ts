import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, shareReplay, tap } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthState } from './auth.state';
import { hydrate } from '../common/hydrate.pipe';
import { reducer } from '../common/reduce';
import { JwtService } from './jwt.service';
import { Response } from 'clan.events.common/responses';
import { JwtTokenContent } from './jwt.token';
@Injectable()
export class AuthService {
  private readonly initialState: AuthState = {
    accessToken: '',
  };

  private readonly _authState$ = new BehaviorSubject<AuthState>(
    this.initialState
  );

  authState$: Observable<AuthState> = this._authState$.pipe(
    hydrate('authState', this.initialState),
    shareReplay(1)
  );

  decodedToken$: Observable<JwtTokenContent | null> = this.authState$.pipe(
    map(authState =>
      authState.accessToken
        ? this.jwtService.decodeToken(authState.accessToken)
        : null
    )
  );

  hasValidToken$: Observable<boolean> = this.decodedToken$.pipe(
    map(
      decodedToken =>
        !!decodedToken &&
        decodedToken.iat + decodedToken.expiresIn > Date.now() / 1000
    )
  );

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  redeemCode(code: string): Observable<Response<{ token: string }>> {
    return this.httpClient
      .post<Response<{ token: string }>>(
        `${this.configService.backEndUrl}/auth/redeem`,
        {
          code,
        }
      )
      .pipe(tap(x => this.handleNewToken(x)));
  }

  refreshCode(refreshToken: string): Observable<Response<{ token: string }>> {
    return this.httpClient
      .post<Response<{ token: string }>>(
        `${this.configService.backEndUrl}/auth/refresh`,
        {
          code: refreshToken,
        }
      )
      .pipe(tap(x => this.handleNewToken(x)));
  }

  logout(): void {
    reducer(this._authState$, this.initialState);
  }

  private handleNewToken(res: Response<{ token: string }>): void {
    reducer(this._authState$, {
      accessToken: res.data.token,
    });
  }
}
