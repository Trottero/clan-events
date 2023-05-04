import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { EventResponse } from 'clan.events.common/events';
import { Observable, filter, map, switchMap } from 'rxjs';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { Memoize } from 'typescript-memoize';
import { Response } from 'clan.events.common/responses';
import { EventsService } from '../../events.service';

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

  @Memoize() public get id$(): Observable<string> {
    return this.route.paramMap
      .pipe(map((params) => params.get('id')))
      .pipe(notNullOrUndefined());
  }

  @Memoize() public get event$(): Observable<Response<EventResponse>> {
    return this.id$.pipe(
      switchMap((id) => this.eventsService.getEventById(id))
    );
  }
}
