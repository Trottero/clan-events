import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventsService } from './events.service';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { EventListItem } from '@common/events';
import { PaginatedResponse } from '@common/responses';
import { PageEvent } from '@angular/material/paginator';

interface FetchEventsOptions {
  page: number;
  pageSize: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent {
  public readonly pageSizeOptions: number[] = [10, 25, 50, 100];

  private readonly page: number = 0;
  private readonly pageSize: number = 10;

  private triggerRefreshSubject = new Subject<FetchEventsOptions>();

  events$: Observable<PaginatedResponse<EventListItem>> =
    this.triggerRefreshSubject.pipe(
      startWith({ page: this.page, pageSize: this.pageSize }),
      switchMap(({ page, pageSize }) =>
        this.eventsService.getEvents({
          page,
          pageSize,
        })
      )
    );

  length$: Observable<number> = this.events$.pipe(
    map(response => response.data.totalItems)
  );

  page$: Observable<number> = this.events$.pipe(
    map(response => response.data.page)
  );

  pageSize$: Observable<number> = this.events$.pipe(
    map(response => response.data.pageSize)
  );

  constructor(private readonly eventsService: EventsService) {}

  onPageChange(event: PageEvent): void {
    this.triggerRefreshSubject.next({
      page: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
