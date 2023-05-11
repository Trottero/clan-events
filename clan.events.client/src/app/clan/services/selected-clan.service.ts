import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
  pairwise,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { ClanApiService } from './clan.api.service';
import { ClanWithRole } from '@common/clan';
import { Router } from '@angular/router';
import { hydrate } from 'src/app/common/hydrate.pipe';
import { ClanParamStream } from 'src/app/shared/streams';
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';
import { AuthService } from 'src/app/auth/auth.service';
import { FILTERED, filterMap } from 'src/app/shared/operators/filter-map';
import { State } from 'src/app/common/state';
import { ClansService } from './clans.service';

export interface SelectedClanState {
  clanName?: string;
}

const INITIAL_STATE: SelectedClanState = {};
@Injectable({
  providedIn: 'root',
})
export class SelectedClanService implements OnDestroy {
  private clanParam$ = inject(ClanParamStream);

  private selectedClanSubject = new State<SelectedClanState>(INITIAL_STATE);

  private selectedClanState$ = this.selectedClanSubject.pipe(
    hydrate<SelectedClanState>('selectedClan', INITIAL_STATE)
  );

  selectedClanName$ = this.selectedClanState$.pipe(
    map(state => state.clanName)
  );

  clans$ = inject(ClansService).clans$;

  selectedClan$: Observable<ClanWithRole | undefined> =
    this.selectedClanName$.pipe(
      switchMap(selectedClan =>
        this.clans$.pipe(map(clans => ({ selectedClan, clans })))
      ),
      map(({ selectedClan, clans }) =>
        this.getSelectedClanOrFirst(selectedClan, clans)
      ),
      shareReplay(1)
    );

  private subscriptions = new Subscription();

  private readonly router = inject(Router);

  constructor() {
    // redirect current page to clan if new clan is selected
    this.subscriptions.add(
      this.selectedClan$.pipe(pairwise()).subscribe(([previous, next]) => {
        if (previous && next && previous.name !== next.name) {
          const url = this.router.url.replace(previous.name, next.name);
          this.router.navigateByUrl(url);
        }
      })
    );

    // update selected clan when clan param changes
    this.subscriptions.add(
      this.clanParam$.pipe(notNullOrUndefined()).subscribe(clanName => {
        this.setSelectedClan(clanName);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setSelectedClan(clanName: string | undefined) {
    this.selectedClanSubject.next({
      clanName,
    });
  }

  private getSelectedClanOrFirst(
    selectedClan: string | undefined,
    clans: ClanWithRole[]
  ): ClanWithRole | undefined {
    const clan = clans.find(clan => clan.name === selectedClan);
    return clan || clans?.[0];
  }
}
