import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventResponse } from 'clan.events.common/events';
import { Observable, map, switchMap } from 'rxjs';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { Response } from 'clan.events.common/responses';
import { EventsService } from '../../events.service';

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

  event$: Observable<Response<EventResponse>> = this.id$.pipe(
    switchMap(id => this.eventsService.getEventById(id))
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventsService: EventsService
  ) {}
}
