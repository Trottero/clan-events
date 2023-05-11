import { Injectable } from '@angular/core';
import { InjectableStream } from 'src/app/shared/observable/injectable-stream';
import { NavigationEnd, Router } from '@angular/router';
import {
  combineLatest,
  distinctUntilChanged,
  distinctUntilKeyChanged,
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
import { ClanApiService } from 'src/app/clan/services/clan.api.service';
import { Clan } from '@common/clan';

@Injectable({
  providedIn: 'root',
})
export class SelectedClanStream extends InjectableStream<Clan | undefined> {
  constructor(selectedClanService: SelectedClanService) {
    super(
      selectedClanService.selectedClan$.pipe(
        distinctUntilChanged(),
        shareReplay(1)
      )
    );
  }
}
