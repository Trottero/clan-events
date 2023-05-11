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
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { EventsService } from '../../events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';
import { SelectedClanStream } from 'src/app/shared/streams';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit, OnDestroy {
  private selectedClan$ = inject(SelectedClanStream).pipe(notNullOrUndefined());

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

  private createEventSubject = new Subject<void>();

  private readonly subscription = new Subscription();

  constructor(
    private readonly eventsService: EventsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addCreateEventSubscription();
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

  private addCreateEventSubscription(): void {
    this.subscription.add(
      this.createEventSubject
        .pipe(
          withLatestFrom(this.formGroup.value$, this.selectedClan$),
          switchMap(([_, value, clan]) =>
            this.eventsService.createEvent(clan.name, {
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
