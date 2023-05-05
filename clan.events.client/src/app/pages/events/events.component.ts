import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventListItem } from 'clan.events.common/dist/events';
import { EventsService } from './events.service';
import { PaginatedResponse } from 'clan.events.common/dist/responses';
import { Observable } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  private readonly page: number = 0;
  private readonly pageSize: number = 10;

  events$: Observable<PaginatedResponse<EventListItem>> =
    this.eventsService.getEvents({
      page: this.page,
      pageSize: this.pageSize,
    });

  constructor(private readonly eventsService: EventsService) {}
}
