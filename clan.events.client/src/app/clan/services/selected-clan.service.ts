import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  map,
  pairwise,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { ClanService } from './clan.service';
import { ClanWithRole } from '@common/clan';
import { Router } from '@angular/router';
import { hydrate } from 'src/app/common/hydrate.pipe';
import { ClanParamStream } from 'src/app/shared/streams';
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';

@Injectable({
  providedIn: 'root',
})
export class SelectedClanService implements OnDestroy {
  private clanParam$ = inject(ClanParamStream);

  private selectedClanSubject = new BehaviorSubject<string | undefined>(
    undefined
  );

  private hydratedSelectedClan$ = this.selectedClanSubject.pipe(
    map(selectedClan => ({ selectedClan })),
    hydrate<{ selectedClan?: string }>('selectedClan', {
      selectedClan: undefined,
    }),
    map(clan => clan.selectedClan),
    shareReplay(1)
  );

  clans$ = this.hydratedSelectedClan$.pipe(
    switchMap(() => this.clanService.getClans()),
    shareReplay(1)
  );

  selectedClan$: Observable<ClanWithRole | undefined> =
    this.hydratedSelectedClan$.pipe(
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

  constructor(private readonly clanService: ClanService) {
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
    this.selectedClanSubject.next(clanName);
  }

  private getSelectedClanOrFirst(
    selectedClan: string | undefined,
    clans: ClanWithRole[]
  ): ClanWithRole | undefined {
    const clan = clans.find(clan => clan.name === selectedClan);

    if (clan) {
      return clan;
    }

    return clans.length > 0 ? clans[0] : undefined;
  }
}
