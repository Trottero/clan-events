import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { AuthState } from './auth.state';
import { ApiResponse } from '../common/api.response';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  initialState: AuthState = {
    access_token: '',
    token_type: '',
    expires_at: 0,
    refresh_token: '',
  };

  private _authState$: BehaviorSubject<AuthState> =
    new BehaviorSubject<AuthState>(this.initialState);

  authState$: Observable<AuthState> = this._authState$.pipe(tap(console.log));

  hasValidToken$ = this.authState$.pipe(
    map(
      (authState) =>
        !!authState.access_token &&
        !!authState.refresh_token &&
        authState.expires_at > Date.now()
    )
  );

  redeemCode(code: string): Observable<any> {
    return this.httpClient
      .post<ApiResponse<any>>(`${this.configService.backEndUrl}/auth/redeem`, {
        code,
      })
      .pipe(
        tap((res) => {
          this._authState$.next({
            ...res.data,
            expires_at: Date.now() + res.data.expires_in * 1000,
          });
          this.userService.infoReceived(res.data.user);
        })
      );
  }

  refreshCode(refreshToken: string): Observable<any> {
    return this.httpClient
      .post<ApiResponse<any>>(`${this.configService.backEndUrl}/auth/refresh`, {
        code: refreshToken,
      })
      .pipe(
        tap((res) => {
          this._authState$.next({
            ...res.data,
            expires_at: Date.now() + res.data.expires_in * 1000,
          });
          this.userService.infoReceived(res.data.user);
        })
      );
  }

  logout() {
    this._authState$.next(this.initialState);
    this.userService.logout();
  }
}
