import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventResponse } from '@common/events';
import { Observable, Subscription, combineLatest, map, switchMap } from 'rxjs';
import { Response } from '@common/responses';
import { EventsService } from '../../events.service';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { EventIdStream } from '../../streams/event-id.stream';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy {
  selectedClan$ = inject(SelectedClanService).selectedClan$.pipe(
    notNullOrUndefined()
  );

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);

  id$ = inject(EventIdStream).pipe(notNullOrUndefined());

  event$: Observable<Response<EventResponse>> = combineLatest([
    this.id$,
    this.selectedClan$,
  ]).pipe(
    switchMap(([id, selectedClan]) =>
      this.eventsService.getEventById(id, selectedClan.name)
    )
  );

  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.subscriptions.add(
      this.event$.subscribe(event => {
        console.log(event);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

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
