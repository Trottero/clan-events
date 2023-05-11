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
} from 'rxjs';
import { EventsService } from '../../events.service';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Validators } from '@angular/forms';
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';
import { SelectedClanStream } from 'src/app/shared/streams';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit, OnDestroy {
  private selectedClan$ = inject(SelectedClanStream).pipe(notNullOrUndefined());

  id$: Observable<string> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    notNullOrUndefined()
  );

  event$: Observable<Response<EventResponse>> = this.id$.pipe(
    withLatestFrom(this.selectedClan$),
    switchMap(([id, clan]) => this.eventsService.getEventById(id, clan.name))
  );

  boardTypeOptions$ = of(
    Object.values(BoardType).map(value => ({ label: value, value }))
  );

  name = new FormControl<string>('', [Validators.required]);
  description = new FormControl<string>('', [Validators.required]);
  startsAt = new FormControl<Date | undefined>(undefined, [
    Validators.required,
  ]);
  endsAt = new FormControl<Date | undefined>(undefined, [Validators.required]);
  boardType = new FormControl<BoardType | undefined>(undefined, [
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

  constructor(
    private readonly eventsService: EventsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

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
            this.eventsService.updateEvent(id, clan.name, {
              name: value.name,
              description: value.description,
              startsAt: value.startsAt ?? new Date(),
              endsAt: value.endsAt ?? new Date(),
              boardType: value.boardType ?? BoardType.Unknown,
            })
          )
        )
        .subscribe(event =>
          // navigate to event page
          this.router.navigate(['/events', event.data.id])
        )
    );
  }
}
