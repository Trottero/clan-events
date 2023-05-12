import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BoardApiService } from './board.api.service';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import { EventIdStream } from '../../streams/event-id.stream';
import {
  Subject,
  Subscription,
  combineLatest,
  startWith,
  switchMap,
} from 'rxjs';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { mapToLoadable } from 'src/app/common/operators/loadable';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  private readonly boardApiService = inject(BoardApiService);
  private readonly selectedClanService = inject(SelectedClanService);

  private readonly createTileTriggerSubject = new Subject<void>();
  private readonly subscriptions = new Subscription();

  eventId$ = inject(EventIdStream);

  tiles$ = combineLatest([
    this.createTileTriggerSubject.pipe(startWith(undefined)),
    this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
    this.eventId$.pipe(notNullOrUndefined()),
  ]).pipe(
    switchMap(([_, clan, eventId]) =>
      this.boardApiService.getTiles(clan.name, eventId).pipe(mapToLoadable())
    )
  );

  ngOnInit(): void {
    this.subscriptions.add(
      this.createTileTriggerSubject
        .pipe(
          switchMap(() =>
            combineLatest([
              this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
              this.eventId$.pipe(notNullOrUndefined()),
            ])
          ),
          switchMap(([clan, eventId]) =>
            this.boardApiService.createTile(clan.name, eventId, {
              name: 'New tile',
              borderColor: '#000000',
              fillColor: '#ffffff',
              borderWidth: 1,
              width: 1,
              height: 1,
              x: 0,
              y: 0,
            })
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createTile() {
    this.createTileTriggerSubject.next();
  }
}
