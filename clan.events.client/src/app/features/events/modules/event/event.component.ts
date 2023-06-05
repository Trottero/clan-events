import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventResponse } from '@common/events';
import {
  Observable,
  Subject,
  Subscription,
  combineLatest,
  startWith,
  switchMap,
} from 'rxjs';
import { Response } from '@common/responses';
import { EventsService } from '../../events.service';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import { EventIdStream } from '../../streams/event-id.stream';
import { BoardModule } from '../board/board.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EditEventComponent } from '../edit-event/edit-event.component';
import { EditEventModule } from '../edit-event/edit-event.module';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BoardModule,
    MatButtonModule,
    MatDialogModule,
    EditEventModule,
  ],
})
export class EventComponent implements OnDestroy {
  selectedClan$ = inject(SelectedClanService).selectedClan$.pipe(
    notNullOrUndefined()
  );

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);
  private readonly dialogService = inject(MatDialog);

  id$ = inject(EventIdStream).pipe(notNullOrUndefined());

  eventUpdateSubject$ = new Subject<void>();

  event$: Observable<Response<EventResponse>> = combineLatest([
    this.id$,
    this.selectedClan$,
    this.eventUpdateSubject$.pipe(startWith(undefined)),
  ]).pipe(
    switchMap(([id, selectedClan]) =>
      this.eventsService.getEventById(id, selectedClan.name)
    )
  );

  private subscriptions = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  back() {
    return this.router.navigate(['../'], { relativeTo: this.route });
  }

  delete(eventId: string): void {
    this.subscriptions.add(
      this.selectedClan$
        .pipe(
          switchMap(clan =>
            this.eventsService.deleteEventById(eventId, clan.name)
          ),
          switchMap(() => this.back())
        )
        .subscribe()
    );
  }

  openEditModal(): void {
    this.dialogService
      .open(EditEventComponent)
      .afterClosed()
      .subscribe(_ => this.eventUpdateSubject$.next());
  }
}
