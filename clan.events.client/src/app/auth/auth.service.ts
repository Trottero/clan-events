import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthState } from './auth.state';
import {
  JwtTokenContent,
  AccessTokenResponse,
  JwtRefreshTokenContent,
} from '@common/auth';
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

  updateDateInterval$ = timer(0, 1000 * 5).pipe(map(() => Date.now()));

  decodedToken$: Observable<JwtTokenContent | null> = this.authState$.pipe(
    map(authState =>
      authState.accessToken
        ? this.jwtService.decodeToken<JwtTokenContent>(authState.accessToken)
        : null
    ),
    shareReplay(1)
  );

  hasValidToken$: Observable<boolean> = combineLatest([
    this.decodedToken$,
    this.updateDateInterval$,
  ]).pipe(
    map(
      ([decodedToken, date]) =>
        !!decodedToken &&
        !!decodedToken.iat &&
        // Expire 1 minute before the token actually expires
        decodedToken.iat + decodedToken.expiresIn - 60 > date / 1000
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );

  decodedRefreshToken$: Observable<JwtRefreshTokenContent | null> =
    this.authState$.pipe(
      map(authState =>
        authState.refreshToken
          ? this.jwtService.decodeToken<JwtRefreshTokenContent>(
              authState.refreshToken
            )
          : null
      ),
      shareReplay(1)
    );

  hasValidRefreshToken$: Observable<boolean> = combineLatest([
    this.decodedRefreshToken$,
    this.updateDateInterval$,
  ]).pipe(
    map(
      ([token, date]) =>
        !!token && !!token.iat && token.iat + token.expiresIn - 60 > date / 1000
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );

  isAuthenticated$: Observable<boolean> = combineLatest([
    this.hasValidToken$,
    this.hasValidRefreshToken$,
  ]).pipe(
    map(
      ([hasValidToken, hasValidRefreshToken]) =>
        hasValidToken || hasValidRefreshToken
    )
  );

  autoRefreshToken$ = combineLatest([
    this.authState$,
    this.hasValidToken$,
    this.hasValidRefreshToken$,
  ]).pipe(
    filter(([state]) => !!state.refreshToken && !!state.accessToken),
    debounceTime(1000),
    switchMap(([state, hasValidToken, hasValidRefreshToken]) => {
      if (!hasValidToken) {
        if (hasValidRefreshToken) {
          return this.refreshAccessToken();
        }
        this.logout();
      }
      return of(null);
    }),
    shareReplay(1)
  );

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

  refreshAccessToken(): Observable<Response<AccessTokenResponse>> {
    return this.httpClient
      .post<Response<AccessTokenResponse>>(
        `${this.configService.backEndUrl}/auth/refresh`,
        {}
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
