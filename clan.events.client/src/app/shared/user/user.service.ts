import { Injectable } from '@angular/core';
import { UserState } from './user.state';
import { Observable, map, shareReplay } from 'rxjs';
import { hydrate } from '../../core/common/pipes/hydrate.pipe';
import { State } from '../../core/common/observable/state';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  readonly initialState: UserState = {
    id: '',
    discordId: 0,
    username: '',
  };

  private readonly _userState$ = new State<UserState>(this.initialState);

  userState$: Observable<UserState> = this._userState$.pipe(
    hydrate('userState', this.initialState),
    shareReplay(1)
  );

  userName$: Observable<string> = this.userState$.pipe(
    map(userState => userState.username)
  );

  constructor(private readonly authService: AuthService) {
    this.authService.decodedToken$.subscribe(decodedToken => {
      if (decodedToken) {
        this.infoReceived({
          id: decodedToken.sub,
          username: decodedToken.username,
          discordId: decodedToken.discordId,
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
