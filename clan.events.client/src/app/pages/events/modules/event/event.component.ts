import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventResponse } from '@common/events';
import { Observable, Subscription, combineLatest, map, switchMap } from 'rxjs';
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';
import { Response } from '@common/responses';
import { EventsService } from '../../events.service';
import { SelectedClanStream } from 'src/app/shared/streams';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {
  selectedClan$ = inject(SelectedClanStream).pipe(notNullOrUndefined());

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);

  id$: Observable<string> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    notNullOrUndefined()
  );

  event$: Observable<Response<EventResponse>> = combineLatest([
    this.id$,
    this.selectedClan$,
  ]).pipe(
    switchMap(([id, selectedClan]) =>
      this.eventsService.getEventById(id, selectedClan.name)
    )
  );

  private subscriptions = new Subscription();

  back() {
    return this.router.navigate(['../'], { relativeTo: this.route });
  }

  delete(eventId: string): void {
    this.subscriptions.add(
      this.selectedClan$
        .pipe(
          switchMap(clan =>
            this.eventsService.deleteEventById(eventId, clan.name)
          ),
          switchMap(() => this.back())
        )
        .subscribe()
    );
  }
}
