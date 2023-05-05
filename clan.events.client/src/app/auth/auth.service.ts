import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthState } from './auth.state';
import { ApiResponse } from '../common/api.response';
import { AccessTokenResponse } from 'clan.events.common/auth';
import { hydrate } from '../common/hydrate.pipe';
import { JwtService } from './jwt.service';
import { State } from '../common/state';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  initialState: AuthState = {
    accessToken: '',
  };

  private _authState$ = new State<AuthState>(this.initialState);

  authState$: Observable<AuthState> = this._authState$.pipe(
    hydrate('authState', this.initialState),
    tap(console.log),
    shareReplay(1)
  );

  decodedToken$ = this.authState$.pipe(
    map((authState) =>
      authState.accessToken
        ? this.jwtService.decodeToken(authState.accessToken)
        : null
    )
  );

  hasValidToken$ = this.decodedToken$.pipe(
    map(
      (decodedToken) =>
        !!decodedToken &&
        decodedToken.iat &&
        decodedToken.iat + decodedToken.expiresIn > Date.now() / 1000
    )
  );

  redeemCode(code: string): Observable<any> {
    return this.httpClient
      .post<ApiResponse<AccessTokenResponse>>(
        `${this.configService.backEndUrl}/auth/redeem`,
        {
          code,
        }
      )
      .pipe(tap((x) => this.handleNewToken(x)));
  }

  refreshCode(refreshToken: string): Observable<any> {
    return this.httpClient
      .post<ApiResponse<AccessTokenResponse>>(
        `${this.configService.backEndUrl}/auth/refresh`,
        {
          code: refreshToken,
        }
      )
      .pipe(tap((x) => this.handleNewToken(x)));
  }

  private handleNewToken(res: ApiResponse<AccessTokenResponse>) {
    this._authState$.next({
      accessToken: res.data.token,
    });
  }

  logout() {
    this._authState$.next(this.initialState);
  }
}
