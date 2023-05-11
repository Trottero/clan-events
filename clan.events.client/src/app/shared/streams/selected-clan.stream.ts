import { Injectable } from '@angular/core';
import { InjectableStream } from 'src/app/shared/observable/injectable-stream';
import { NavigationEnd, Router } from '@angular/router';
import {
  combineLatest,
  filter,
  map,
  publish,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { NAVIGATION_PARAMS } from 'src/app/config/navigation';
import { getRouteParamsFromSnapshot } from '../utils/get-route-params';
import { notNullOrUndefined } from '../operators/not-undefined';
import { ClanParamStream } from './clan-param.stream';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { ClanService } from 'src/app/clan/services/clan.service';
import { Clan } from '@common/clan';

@Injectable({
  providedIn: 'root',
})
export class SelectedClanStream extends InjectableStream<Clan | undefined> {
  constructor(
    private clanParam$: ClanParamStream,
    private selectedClanService: SelectedClanService,
    private clanService: ClanService
  ) {
    super(
      combineLatest([
        clanParam$,
        selectedClanService.selectedClan$,
        selectedClanService.clans$,
      ]).pipe(
        map(([clanName, selectedClan, clans]) => {
          if (clanName !== undefined) {
            return clans.find(x => x.name === clanName);
          }

          return selectedClan;
        }),
        shareReplay(1)
      )
    );
  }
}
