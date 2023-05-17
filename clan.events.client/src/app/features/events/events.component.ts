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
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { EventListItem } from '@common/events';
import { PaginatedResponse } from '@common/responses';
import { PageEvent } from '@angular/material/paginator';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import {
  Loadable,
  filterMapSuccess,
  isLoading,
  isSuccess,
  mapToLoadable,
} from 'src/app/core/common/operators/loadable';
import { FILTERED, filterMap } from 'src/app/core/common/operators/filter-map';

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
  selectedClan$ = inject(SelectedClanService).selectedClan$.pipe(
    notNullOrUndefined()
  );

  private readonly eventsService = inject(EventsService);

  public readonly pageSizeOptions: number[] = [10, 25, 50, 100];

  private readonly page: number = 0;
  private readonly pageSize: number = 10;

  private triggerRefreshSubject = new Subject<FetchEventsOptions>();
  private subscriptions = new Subscription();

  eventsLoadable$: Observable<Loadable<PaginatedResponse<EventListItem>>> =
    combineLatest([
      this.triggerRefreshSubject.pipe(
        startWith({ page: this.page, pageSize: this.pageSize })
      ),
      this.selectedClan$.pipe(notNullOrUndefined()),
    ]).pipe(
      switchMap(([{ page, pageSize }, selectedClan]) =>
        this.eventsService
          .getEvents(selectedClan.name, {
            page,
            pageSize,
          })
          .pipe(mapToLoadable())
      ),
      shareReplay(1)
    );

  events$: Observable<PaginatedResponse<EventListItem>> =
    this.eventsLoadable$.pipe(filterMapSuccess(x => x.value));

  length$: Observable<number> = this.events$.pipe(
    map(response => response.data.totalItems)
  );

  page$: Observable<number> = this.events$.pipe(
    map(response => response.data.page)
  );

  pageSize$: Observable<number> = this.events$.pipe(
    map(response => response.data.pageSize)
  );

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
