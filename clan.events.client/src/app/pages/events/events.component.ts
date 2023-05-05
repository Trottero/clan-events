import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventsService } from './events.service';
import { Observable } from 'rxjs';
import { EventListItem } from '@common/events';
import { PaginatedResponse } from '@common/responses';

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
