import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  map,
  switchMap,
} from 'rxjs';
import { ClanService } from './clan.service';
import { ClanWithRole } from '@common/clan';

@Injectable({
  providedIn: 'root',
})
export class SelectedClanService implements OnDestroy {
  private selectedClanSubject = new BehaviorSubject<string | undefined>(
    undefined
  );

  clans$ = this.selectedClanSubject.pipe(
    switchMap(() => this.clanService.getClans())
  );

  selectedClan$: Observable<ClanWithRole | undefined> =
    this.selectedClanSubject.pipe(
      switchMap(selectedClan =>
        this.clans$.pipe(map(clans => ({ selectedClan, clans })))
      ),
      map(({ selectedClan, clans }) =>
        this.getSelectedClanOrFirst(selectedClan, clans)
      )
    );

  private subscriptions = new Subscription();

  constructor(private readonly clanService: ClanService) {
    this.subscriptions.add(
      this.selectedClan$.subscribe(clan => {
        // save clan to local storage
        localStorage.setItem(
          'selectedClan',
          JSON.stringify(clan?.name ?? null)
        );
      })
    );

    // load clan from local storage
    const selectedClan = localStorage.getItem('selectedClan');
    if (selectedClan) {
      this.selectedClanSubject.next(JSON.parse(selectedClan) ?? undefined);
    }
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
