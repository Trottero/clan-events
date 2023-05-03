import { Injectable } from '@angular/core';
import { UserState } from './user.state';
import { BehaviorSubject, Observable, map } from 'rxjs';

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

  userState$: Observable<UserState> = this._userState$;

  userName$ = this.userState$.pipe(map((userState) => userState.username));

  infoReceived(userState: UserState) {
    this._userState$.next(userState);
  }

  logout() {
    this._userState$.next(this.initialState);
  }
}
