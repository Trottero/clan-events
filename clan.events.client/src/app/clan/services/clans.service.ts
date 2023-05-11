import { Injectable, inject } from '@angular/core';
import {
  Subject,
  combineLatest,
  filter,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ClanApiService } from './clan.api.service';

@Injectable({
  providedIn: 'root',
})
export class ClansService {
  private readonly authService = inject(AuthService);
  private readonly clanApiService = inject(ClanApiService);

  private refreshClansTriggerSubject = new Subject<void>();

  clans$ = combineLatest([
    this.refreshClansTriggerSubject.pipe(startWith(undefined)),
    this.authService.isAuthenticated$.pipe(
      filter(isAuthenticated => isAuthenticated)
    ),
  ]).pipe(
    switchMap(() => this.clanApiService.getClans()),
    shareReplay(1)
  );

  public refreshClans() {
    this.refreshClansTriggerSubject.next();
  }
}
