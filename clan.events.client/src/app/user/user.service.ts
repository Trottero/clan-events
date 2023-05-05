import { Injectable } from '@angular/core';
import { UserState } from './user.state';
import { Observable, map, shareReplay } from 'rxjs';
import { hydrate } from '../common/hydrate.pipe';
import { AuthService } from '../auth/auth.service';
import { State } from '../common/state';

@Injectable()
export class UserService {
  initialState: UserState = {
    id: 0,
    username: '',
  };

  private _userState$ = new State<UserState>(this.initialState);

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
    this._userState$.next(userState);
  }

  logout() {
    this._userState$.next(this.initialState);
    this.authService.logout();
  }
}
