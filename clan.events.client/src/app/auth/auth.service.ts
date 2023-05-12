import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthState } from './auth.state';
import { JwtTokenContent, AccessTokenResponse } from '@common/auth';
import { hydrate } from '../common/hydrate.pipe';
import { JwtService } from './jwt.service';
import { State } from '../common/state';
import { Response } from '@common/responses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly initialState: AuthState = {
    accessToken: '',
    refreshToken: '',
  };

  private readonly _authState$ = new State<AuthState>(this.initialState);

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
        !!decodedToken.iat &&
        decodedToken.iat + decodedToken.expiresIn > Date.now() / 1000
    )
  );

  isAuthenticated$: Observable<boolean> = this.hasValidToken$;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  redeemCode(code: string): Observable<Response<AccessTokenResponse>> {
    return this.httpClient
      .post<Response<AccessTokenResponse>>(
        `${this.configService.backEndUrl}/auth/redeem`,
        {
          code,
        }
      )
      .pipe(tap(x => this.handleNewToken(x)));
  }

  refreshCode(refreshToken: string): Observable<Response<AccessTokenResponse>> {
    return this.httpClient
      .post<Response<AccessTokenResponse>>(
        `${this.configService.backEndUrl}/auth/refresh`,
        {
          code: refreshToken,
        }
      )
      .pipe(tap(x => this.handleNewToken(x)));
  }

  logout(): void {
    this._authState$.next(this.initialState);
  }

  private handleNewToken(res: Response<AccessTokenResponse>): void {
    this._authState$.next({
      accessToken: res.data.token,
      refreshToken: res.data.refreshToken,
    });
  }
}
