import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardType, EventResponse } from '@common/events';
import { Response } from '@common/responses';
import {
  of,
  Subject,
  withLatestFrom,
  switchMap,
  Subscription,
  Observable,
  map,
  shareReplay,
} from 'rxjs';
import { EventsService } from '../../events.service';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { SelectedClanStream } from 'src/app/common/streams';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit, OnDestroy {
  private readonly selectedClan$ = inject(SelectedClanStream).pipe(
    notNullOrUndefined()
  );
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  id$: Observable<string> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    notNullOrUndefined()
  );

  event$: Observable<Response<EventResponse>> = this.id$.pipe(
    withLatestFrom(this.selectedClan$),
    switchMap(([id, clan]) => this.eventsService.getEventById(id, clan.name))
  );

  boardTypeOptions$ = of(
    Object.values(BoardType)
      .map(value => ({ label: value, value }))
      .filter(value => value.value !== BoardType.Unknown)
  ).pipe(shareReplay(1));

  name = new FormControl<string>('', [Validators.required]);
  description = new FormControl<string>('', [Validators.required]);
  startsAt = new FormControl<Date>(new Date(), [Validators.required]);
  endsAt = new FormControl<Date>(new Date(), [Validators.required]);
  boardType = new FormControl<BoardType>(BoardType.Unknown, [
    Validators.required,
  ]);

  formGroup = new FormGroup({
    name: this.name,
    description: this.description,
    startsAt: this.startsAt,
    endsAt: this.endsAt,
    boardType: this.boardType,
  });

  private updateEventSubject = new Subject<void>();

  private readonly subscription = new Subscription();

  ngOnInit(): void {
    this.addLoadFormDataSubscription();
    this.addEditEventSubscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.formGroup.dirty$;
  }

  back() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancel(): void {
    this.subscription.add(
      this.id$.subscribe(id => this.router.navigate(['/events', id]))
    );
  }

  update(): void {
    this.updateEventSubject.next();
  }

  private addLoadFormDataSubscription(): void {
    this.subscription.add(
      this.event$.subscribe(event => {
        this.formGroup.patchValue({
          name: event.data.name,
          description: event.data.description,
          startsAt: event.data.startsAt,
          endsAt: event.data.endsAt,
          boardType: event.data.board.type,
        });
      })
    );
  }

  private addEditEventSubscription(): void {
    this.subscription.add(
      this.updateEventSubject
        .pipe(
          withLatestFrom(this.formGroup.value$, this.id$, this.selectedClan$),
          switchMap(([_, value, id, clan]) =>
            this.eventsService
              .updateEvent(id, clan.name, {
                name: value.name,
                description: value.description,
                startsAt: value.startsAt ?? new Date(),
                endsAt: value.endsAt ?? new Date(),
                boardType: value.boardType ?? BoardType.Unknown,
              })
              .pipe(map(event => ({ event, clan })))
          ),
          switchMap(({ event, clan }) =>
            this.router.navigate(['/', clan.name, 'events', event.data.id])
          )
        )
        .subscribe()
    );
  }
}
