import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { BoardType, CreateEventRequest, EventVisibility } from '@common/events';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import {
  Observable,
  Subject,
  Subscription,
  map,
  of,
  shareReplay,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { EventsService } from '../../events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';

const INITIAL_START_DATE = new Date();
const INITIAL_END_DATE = new Date();

INITIAL_END_DATE.setDate(INITIAL_END_DATE.getDate() + 7);

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit, OnDestroy {
  selectedClan$ = inject(SelectedClanService).selectedClan$.pipe(
    notNullOrUndefined()
  );
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  boardTypeOptions$ = of(
    Object.values(BoardType)
      .map(value => ({ label: value, value }))
      .filter(value => value.value !== BoardType.Unknown)
  ).pipe(shareReplay(1));

  eventVisibilityOptions$ = of(
    Object.values(EventVisibility).map(value => ({ label: value, value }))
  ).pipe(shareReplay(1));

  name = new FormControl<string>('', [Validators.required]);
  description = new FormControl<string>('', [Validators.required]);
  startsAt = new FormControl<Date>(INITIAL_START_DATE, [Validators.required]);
  endsAt = new FormControl<Date>(INITIAL_END_DATE, [Validators.required]);
  boardType = new FormControl<BoardType>(BoardType.Tilerace, [
    Validators.required,
  ]);
  eventVisibility = new FormControl<EventVisibility>(EventVisibility.Private, [
    Validators.required,
  ]);

  formGroup = new FormGroup({
    name: this.name,
    description: this.description,
    startsAt: this.startsAt,
    endsAt: this.endsAt,
    boardType: this.boardType,
    eventVisibility: this.eventVisibility,
  });

  private createEventSubject = new Subject<void>();

  private readonly subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.createEventSubject
        .pipe(
          withLatestFrom(this.formGroup.value$, this.selectedClan$),
          switchMap(([_, value, clan]) =>
            this.eventsService
              .createEvent(clan.name, {
                name: value.name,
                description: value.description,
                startsAt: value.startsAt,
                endsAt: value.endsAt,
                boardType: value.boardType,
                eventVisibility: value.eventVisibility,
              })
              .pipe(
                map(event => ({
                  event,
                  clan,
                }))
              )
          ),
          switchMap(({ event, clan }) =>
            this.router.navigate(['/', clan.name, 'events', event.data.id])
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  create(): void {
    this.createEventSubject.next();
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
