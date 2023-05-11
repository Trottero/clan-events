import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, publish, share, shareReplay, startWith, tap } from 'rxjs';
import { NAVIGATION_PARAMS } from 'src/app/config/navigation';
import { getRouteParamsFromSnapshot } from '../utils/get-route-params';
import { notNullOrUndefined } from '../operators/not-undefined';
import { InjectableStream } from '../observable/injectable-stream';

@Injectable({
  providedIn: 'root',
})
export class ClanParamStream extends InjectableStream<string | undefined> {
  constructor(router: Router) {
    super(
      router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(undefined),
        map(() =>
          getRouteParamsFromSnapshot<string>(
            router.routerState.root.snapshot,
            NAVIGATION_PARAMS.CLAN_NAME
          )
        ),
        shareReplay(1)
      )
    );
  }
}
