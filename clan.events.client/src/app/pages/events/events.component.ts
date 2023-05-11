import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { EventsService } from './events.service';
import {
  Observable,
  Subject,
  Subscription,
  combineLatest,
  map,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { EventListItem } from '@common/events';
import { PaginatedResponse } from '@common/responses';
import { PageEvent } from '@angular/material/paginator';
import { SelectedClanStream } from 'src/app/shared/streams';
import { notNullOrUndefined } from 'src/app/shared/operators/not-undefined';

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
export class EventsComponent implements OnDestroy {
  public readonly pageSizeOptions: number[] = [10, 25, 50, 100];

  private readonly page: number = 0;
  private readonly pageSize: number = 10;

  private triggerRefreshSubject = new Subject<FetchEventsOptions>();
  private subscriptions = new Subscription();

  selectedClan$ = inject(SelectedClanStream);

  events$: Observable<PaginatedResponse<EventListItem>> = combineLatest([
    this.triggerRefreshSubject.pipe(
      startWith({ page: this.page, pageSize: this.pageSize })
    ),
    this.selectedClan$.pipe(notNullOrUndefined()),
  ]).pipe(
    switchMap(([{ page, pageSize }, selectedClan]) =>
      this.eventsService.getEvents(selectedClan.name, {
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPageChange(event: PageEvent): void {
    this.triggerRefreshSubject.next({
      page: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
}
