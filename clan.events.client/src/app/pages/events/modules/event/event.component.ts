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
  id$: Observable<string> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    notNullOrUndefined()
  );

  selectedClan$ = inject(SelectedClanStream).pipe(notNullOrUndefined());

  event$: Observable<Response<EventResponse>> = combineLatest([
    this.id$,
    this.selectedClan$,
  ]).pipe(
    switchMap(([id, selectedClan]) =>
      this.eventsService.getEventById(id, selectedClan.name)
    )
  );

  private subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventsService: EventsService
  ) {}

  back() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  delete(eventId: string): void {
    this.subscriptions.add(
      this.selectedClan$
        .pipe(
          switchMap(clan =>
            this.eventsService.deleteEventById(eventId, clan.name)
          )
        )
        .subscribe(() => {
          this.back();
        })
    );
  }
}
