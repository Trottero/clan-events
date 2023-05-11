import { Injectable, OnDestroy, OnInit, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  distinct,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  map,
  pairwise,
  shareReplay,
  switchMap,
} from 'rxjs';
import { ClanService } from './clan.service';
import { ClanWithRole } from '@common/clan';
import { ActivatedRoute, Router } from '@angular/router';
import { hydrate } from 'src/app/common/hydrate.pipe';

@Injectable({
  providedIn: 'root',
})
export class SelectedClanService implements OnDestroy {
  private selectedClanSubject = new BehaviorSubject<string | undefined>(
    undefined
  );

  clans$ = this.selectedClanSubject.pipe(
    switchMap(() => this.clanService.getClans()),
    shareReplay(1)
  );

  selectedClan$: Observable<ClanWithRole | undefined> =
    this.selectedClanSubject.pipe(
      switchMap(selectedClan =>
        this.clans$.pipe(map(clans => ({ selectedClan, clans })))
      ),
      map(({ selectedClan, clans }) =>
        this.getSelectedClanOrFirst(selectedClan, clans)
      ),
      map(clan => ({ selectedClan: clan })),
      hydrate<{ selectedClan?: ClanWithRole }>('selectedClan', {
        selectedClan: undefined,
      }),
      map(clan => clan?.selectedClan),
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
