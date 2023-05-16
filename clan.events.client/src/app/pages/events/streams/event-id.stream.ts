import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, shareReplay, startWith } from 'rxjs';
import { InjectableStream } from 'src/app/common/observable/injectable-stream';
import { getRouteParamsFromSnapshot } from 'src/app/common/utils/get-route-params';
import { NAVIGATION_PARAMS } from 'src/app/config/navigation';

@Injectable({
  providedIn: 'root',
})
export class EventIdStream extends InjectableStream<string | undefined> {
  constructor(router: Router) {
    super(
      router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(undefined),
        map(() =>
          getRouteParamsFromSnapshot<string>(
            router.routerState.root.snapshot,
            NAVIGATION_PARAMS.EVENT_ID
          )
        ),
        shareReplay(1)
      )
    );
  }
}
