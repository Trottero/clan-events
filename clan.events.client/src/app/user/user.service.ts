import { Injectable } from '@angular/core';
import { UserState } from './user.state';
import { BehaviorSubject, Observable, map, shareReplay } from 'rxjs';
import { hydrate } from '../common/hydrate.pipe';
import { reducer } from '../common/reduce';

@Injectable()
export class UserService {
  initialState: UserState = {
    id: '',
    username: '',
    discriminator: '',
    avatar: '',
    verified: false,
    email: '',
    flags: 0,
    banner: '',
    accent_color: 0,
    premium_type: 0,
    public_flags: 0,
  };

  private _userState$: BehaviorSubject<UserState> =
    new BehaviorSubject<UserState>(this.initialState);

  userState$: Observable<UserState> = this._userState$.pipe(
    hydrate('userState', this.initialState),
    shareReplay(1)
  );

  userName$ = this.userState$.pipe(map((userState) => userState.username));

  infoReceived(userState: UserState) {
    reducer(this._userState$, userState);
  }

  logout() {
    reducer(this._userState$, this.initialState);
  }
}
