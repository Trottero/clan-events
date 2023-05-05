import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventListItem } from 'clan.events.common/events';
import { EventsService } from './events.service';
import { PaginatedResponse } from 'clan.events.common/responses';
import { Observable } from 'rxjs';
import { Memoized } from 'src/app/common/decorators/memoized.decorator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  private readonly page: number = 0;
  private readonly pageSize: number = 10;

  constructor(private readonly eventsService: EventsService) {}

  @Memoized public get events$(): Observable<PaginatedResponse<EventListItem>> {
    return this.eventsService.getEvents({
      page: this.page,
      pageSize: this.pageSize,
    });
  }
}
