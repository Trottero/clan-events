import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, shareReplay, tap } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthState } from './auth.state';
import { ApiResponse } from '../common/api.response';
import { UserService } from '../user/user.service';
import { hydrate } from '../common/hydrate.pipe';
import { reducer } from '../common/reduce';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  initialState: AuthState = {
    access_token: { token: '', expires_at: 0 },
    refresh_token: { token: '', expires_at: 0 },
  };

  private _authState$ = new BehaviorSubject<AuthState>(this.initialState);

  authState$: Observable<AuthState> = this._authState$.pipe(
    hydrate('authState', this.initialState),
    tap(console.log),
    shareReplay(1)
  );

  hasValidToken$ = this.authState$.pipe(
    map(
      (authState) =>
        !!authState.access_token &&
        !!authState.refresh_token &&
        authState.access_token.expires_at > Date.now()
    )
  );

  redeemCode(code: string): Observable<any> {
    return this.httpClient
      .post<ApiResponse<any>>(`${this.configService.backEndUrl}/auth/redeem`, {
        code,
      })
      .pipe(tap((x) => this.handleNewToken(x)));
  }

  refreshCode(refreshToken: string): Observable<any> {
    return this.httpClient
      .post<ApiResponse<any>>(`${this.configService.backEndUrl}/auth/refresh`, {
        code: refreshToken,
      })
      .pipe(tap((x) => this.handleNewToken(x)));
  }

  private handleNewToken(res: ApiResponse<any>) {
    reducer(this._authState$, {
      access_token: {
        token: res.data.access_token,
        expires_at: Date.now() + res.data.expires_in * 1000,
      },
      refresh_token: {
        token: res.data.refresh_token,
        expires_at: Date.now() + 24 * 7 * 3600 * 1000,
      },
    });

    this.userService.infoReceived(res.data.user);
  }

  logout() {
    reducer(this._authState$, this.initialState);
    this.userService.logout();
  }
}
