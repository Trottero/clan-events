import { Injectable } from '@angular/core';
import { UserState } from './user.state';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { hydrate } from '../common/hydrate.pipe';
import { reducer } from '../common/reduce';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  public initialState: UserState = {
    id: '',
    username: '',
  };

  private readonly _userState$: BehaviorSubject<UserState> =
    new BehaviorSubject<UserState>(this.initialState);

  public userState$: Observable<UserState> = this._userState$.pipe(
    hydrate('userState', this.initialState),
    shareReplay(1),
  );

  public userName$: Observable<string> = this.userState$.pipe(
    map((userState) => userState.username),
  );

  constructor(private readonly authService: AuthService) {
    this.authService.decodedToken$.subscribe((decodedToken) => {
      if (decodedToken) {
        this.infoReceived({
          id: decodedToken.sub,
          username: decodedToken.username,
        });
      }
    });
  }

  public infoReceived(userState: UserState): void {
    reducer(this._userState$, userState);
  }

  public logout(): void {
    reducer(this._userState$, this.initialState);

    this.authService.logout();
  }
}
