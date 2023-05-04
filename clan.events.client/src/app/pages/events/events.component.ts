import { Component } from '@angular/core';
import { EventListItem } from 'clan.events.common/events';
import { EventsService } from './events.service';
import { PaginatedResponse } from 'clan.events.common/responses';
import { Observable, map } from 'rxjs';
import { Memoized } from 'src/app/common/decorators/memoized.decorator';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  private page: number = 0;
  private pageSize: number = 10;

  constructor(private readonly eventsService: EventsService) {}

  @Memoized public get events$(): Observable<PaginatedResponse<EventListItem>> {
    return this.eventsService.getEvents({
      page: this.page,
      pageSize: this.pageSize,
    });
  }
}
