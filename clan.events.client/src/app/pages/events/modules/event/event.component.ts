import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EventResponse } from 'clan.events.common/events';
import { Observable, filter, map, switchMap } from 'rxjs';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { Response } from 'clan.events.common/responses';
import { EventsService } from '../../events.service';
import { Memoized } from 'src/app/common/decorators/memoized.decorator';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventsService: EventsService
  ) {}

  public id$: Observable<string> = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    notNullOrUndefined()
  );

  public event$: Observable<Response<EventResponse>> = this.id$.pipe(
    switchMap((id) => this.eventsService.getEventById(id))
  );
}
