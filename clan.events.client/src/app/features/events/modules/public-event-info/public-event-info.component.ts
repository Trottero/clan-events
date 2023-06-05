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
        const timeText = this.timeToText(secondsBeforeStart);
        return secondsBeforeStart > 0
          ? `Starts in ${timeText}`
          : `Started ${timeText} ago`;
      }
      if (secondsBeforeEnd > 0) {
        const timeText = this.timeToText(secondsBeforeEnd);
        return secondsBeforeEnd > 0
          ? `Ends in ${timeText}`
          : `Ended ${timeText} ago`;
      }
      return 'Finished';
    })
  );

  roleEnum = ClanRole;

  private timeToText(seconds: number): string {
    const computeTime = Math.abs(seconds);

    if (computeTime < 60) {
      return computeTime != 1
        ? `${computeTime} seconds`
        : `${computeTime} second`;
    }

    const minutes = Math.floor(computeTime / 60);
    if (minutes < 60) {
      return minutes != 1 ? `${minutes} minutes` : `${minutes} minute`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours != 1 ? `${hours} hours` : `${hours} hour`;
    }

    const days = Math.floor(hours / 24);
    return days != 1 ? `${days} days` : `${days} day`;
  }
}
