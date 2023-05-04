import { Injectable } from '@angular/core';
import { UserState } from './user.state';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { hydrate } from '../common/hydrate.pipe';
import { reducer } from '../common/reduce';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  initialState: UserState = {
    id: '',
    username: '',
  };

  private _userState$: BehaviorSubject<UserState> =
    new BehaviorSubject<UserState>(this.initialState);

  userState$: Observable<UserState> = this._userState$.pipe(
    hydrate('userState', this.initialState),
    shareReplay(1)
  );

  userName$ = this.userState$.pipe(map((userState) => userState.username));

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

  infoReceived(userState: UserState) {
    reducer(this._userState$, userState);
  }

  logout() {
    reducer(this._userState$, this.initialState);

    this.authService.logout();
  }
}
