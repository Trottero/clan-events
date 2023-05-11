import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { BoardType, CreateEventRequest } from '@common/events';
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
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';
import { SelectedClanStream } from 'src/app/shared/streams';

const INITIAL_START_DATE = new Date();
const INITIAL_END_DATE = new Date();

INITIAL_END_DATE.setDate(INITIAL_END_DATE.getDate() + 7);

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit, OnDestroy {
  private readonly selectedClan$ = inject(SelectedClanStream).pipe(
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

  name = new FormControl<string>('', [Validators.required]);
  description = new FormControl<string>('', [Validators.required]);
  startsAt = new FormControl<Date>(INITIAL_START_DATE, [Validators.required]);
  endsAt = new FormControl<Date>(INITIAL_END_DATE, [Validators.required]);
  boardType = new FormControl<BoardType>(BoardType.Tilerace, [
    Validators.required,
  ]);

  formGroup = new FormGroup({
    name: this.name,
    description: this.description,
    startsAt: this.startsAt,
    endsAt: this.endsAt,
    boardType: this.boardType,
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
