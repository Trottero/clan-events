import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BoardType, CreateEventRequest } from '@common/events';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Observable, Subject, map, of, switchMap, withLatestFrom } from 'rxjs';
import { EventsService } from '../../events.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
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

  constructor(
    private readonly eventsService: EventsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.formGroup.valid$.subscribe(valid => console.log(valid));
    this.formGroup.value$.subscribe(value => console.log(value));

    this.createEventSubject
      .pipe(
        withLatestFrom(this.formGroup.value$),
        switchMap(([_, value]) =>
          this.eventsService.createEvent({
            name: value.name,
            description: value.description,
            startsAt: value.startsAt ?? new Date(),
            endsAt: value.endsAt ?? new Date(),
            boardType: value.boardType ?? BoardType.Unknown,
            boardName: '',
          })
        )
      )
      .subscribe(event =>
        // navigate to event page
        this.router.navigate(['/events', event.data.id])
      );
  }

  create(): void {
    this.createEventSubject.next();
  }
}