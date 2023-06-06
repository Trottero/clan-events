import { Component, inject } from '@angular/core';
import { EventIdStream } from '../../streams/event-id.stream';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { EventResponse } from '@common/index';
import {
  Observable,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  timer,
} from 'rxjs';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import { EventsService } from '../../events.service';
import { EventsModule } from '../../events.module';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ClanRole } from '@common/auth/clan.role';
import * as dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

@Component({
  selector: 'app-public-event-info',
  templateUrl: './public-event-info.component.html',
  styleUrls: ['./public-event-info.component.scss'],
  standalone: true,
  imports: [
    EventsModule,
    CommonModule,
    MatCommonModule,
    MatButtonModule,
    RouterModule,
  ],
})
export class PublicEventInfoComponent {
  private readonly eventsService = inject(EventsService);
  private readonly selectedClanService = inject(SelectedClanService);

  id$ = inject(EventIdStream).pipe(notNullOrUndefined());

  event$: Observable<EventResponse> = combineLatest([
    this.id$,
    this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
  ]).pipe(
    switchMap(([id, selectedClan]) =>
      this.eventsService
        .getEventById(id, selectedClan.name)
        .pipe(map(x => x.data))
    ),
    shareReplay(1)
  );

  currentTime$ = timer(0, 1000).pipe(
    map(() => Date.now()),
    shareReplay(1)
  );

  secondsBeforeStart$ = combineLatest([this.event$, this.currentTime$]).pipe(
    map(([event, currentTime]) =>
      Math.floor((new Date(event.startsAt).getTime() - currentTime) / 1000)
    )
  );

  secondsBeforeEnd$ = combineLatest([this.event$, this.currentTime$]).pipe(
    map(([event, currentTime]) =>
      Math.floor((new Date(event.endsAt).getTime() - currentTime) / 1000)
    )
  );

  role$ = this.selectedClanService.selectedClan$.pipe(
    notNullOrUndefined(),
    map(x => x.role)
  );

  eventStatus$ = combineLatest([
    this.secondsBeforeStart$,
    this.secondsBeforeEnd$,
  ]).pipe(
    map(([secondsBeforeStart, secondsBeforeEnd]) => {
      if (secondsBeforeStart > 0) {
        return `Starts ${dayjs
          .duration(secondsBeforeStart, 'seconds')
          .humanize(true)}`;
      }
      if (secondsBeforeEnd > 0) {
        return `Ends ${dayjs
          .duration(secondsBeforeEnd, 'seconds')
          .humanize(true)}`;
      }
      return `Ended ${dayjs
        .duration(secondsBeforeEnd, 'seconds')
        .humanize(true)}`;
    })
  );

  roleEnum = ClanRole;
}
