import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Observable,
  Subscription,
  catchError,
  filter,
  map,
  of,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ClanWithRole } from '@common/clan';
import { NavigationEnd, Router } from '@angular/router';
import { hydrate } from 'src/app/common/hydrate.pipe';
import { State } from 'src/app/common/state';
import { ClansService } from './clans.service';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { getRouteParamsFromSnapshot } from 'src/app/common/utils/get-route-params';
import { NAVIGATION_PARAMS } from 'src/app/config/navigation';

export interface SelectedClanState {
  clanName?: string;
}

const INITIAL_STATE: SelectedClanState = {};
@Injectable({
  providedIn: 'root',
})
export class SelectedClanService implements OnDestroy {
  private readonly router = inject(Router);

  clanParam$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(undefined),
    map(() =>
      getRouteParamsFromSnapshot<string>(
        this.router.routerState.root.snapshot,
        NAVIGATION_PARAMS.CLAN_NAME
      )
    ),
    shareReplay(1)
  );

  private selectedClanSubject = new State<SelectedClanState>(INITIAL_STATE);

  private selectedClanState$ = this.selectedClanSubject.pipe(
    hydrate<SelectedClanState>('selectedClan', INITIAL_STATE),
    shareReplay(1)
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
      this.clanParam$
        .pipe(notNullOrUndefined(), withLatestFrom(this.selectedClanName$))
        .subscribe(([clanName, selectedClanName]) => {
          if (clanName !== selectedClanName) {
            this.setSelectedClan(clanName);
          }
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
