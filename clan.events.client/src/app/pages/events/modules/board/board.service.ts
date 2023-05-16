import { Injectable, inject } from '@angular/core';
import {
  combineLatest,
  startWith,
  switchMap,
  shareReplay,
  Subject,
  Subscription,
  catchError,
  BehaviorSubject,
} from 'rxjs';
import { SelectedClanService } from 'src/app/clan/services/selected-clan.service';
import {
  filterMapSuccess,
  mapToLoadable,
} from 'src/app/common/operators/loadable';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';
import { BoardApiService } from './board.api.service';
import { EventIdStream } from '../../streams/event-id.stream';
import { State } from 'src/app/common/state';
import { TileResponse } from '@common/events';
import { SimpleBoardRenderer } from './renderers/simple-board-renderer';
import { BoardRenderer } from './renderers/board-renderer';

export interface BoardState {
  selectedTileId: string | null;
}

const INITIAL_STATE: BoardState = {
  selectedTileId: null,
};

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly boardApiService = inject(BoardApiService);
  private readonly selectedClanService = inject(SelectedClanService);
  private readonly eventId$ = inject(EventIdStream);
  private readonly subscriptions = new Subscription();

  private readonly createTileTriggerSubject = new Subject<void>();
  private readonly updateSelectedTileSubject = new Subject<
    Partial<TileResponse> & { id: string }
  >();
  private readonly resetCanvasSubject = new Subject<void>();
  private readonly refreshTilesSubject = new Subject<void>();

  private readonly boardRendererSubject =
    new BehaviorSubject<BoardRenderer | null>(null);

  private boardState = new State<BoardState>(INITIAL_STATE);

  tiles$ = combineLatest([
    this.refreshTilesSubject.pipe(startWith(undefined)),
    this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
    this.eventId$.pipe(notNullOrUndefined()),
  ]).pipe(
    switchMap(([_, clan, eventId]) =>
      this.boardApiService.getTiles(clan.name, eventId).pipe(mapToLoadable())
    ),
    shareReplay(1)
  );

  selectedTile$ = this.boardState.pipe(
    switchMap(state =>
      this.tiles$.pipe(
        filterMapSuccess(tiles =>
          tiles.value.data.find(t => t.id === state.selectedTileId)
        )
      )
    )
  );

  resetCanvas$ = this.resetCanvasSubject.pipe(startWith(undefined));

  boardRenderer$ = this.boardRendererSubject.pipe(notNullOrUndefined());

  createTileTrigger$ = this.createTileTriggerSubject.pipe(
    switchMap(() =>
      combineLatest([
        this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
        this.eventId$.pipe(notNullOrUndefined()),
      ])
    ),
    switchMap(([clan, eventId]) =>
      this.boardApiService.createTile(clan.name, eventId, {
        name: 'New Tile',
        borderColor: '#915ead',
        fillColor: '#decfe6',
        borderWidth: 5,
        width: 100,
        height: 100,
        x: 0,
        y: 0,
      })
    )
  );

  updateSelectedTile$ = this.updateSelectedTileSubject.pipe(
    switchMap(update =>
      combineLatest([
        this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
        this.eventId$.pipe(notNullOrUndefined()),
      ]).pipe(
        switchMap(([clan, eventId]) =>
          this.boardApiService.patchTile(clan.name, eventId, update.id, update)
        )
      )
    )
  );

  constructor() {
    this.subscriptions.add(
      this.createTileTrigger$.subscribe(() => this.refreshTilesSubject.next())
    );

    this.subscriptions.add(this.updateSelectedTile$.subscribe());
  }

  setBoardRenderer(boardRenderer: BoardRenderer | null) {
    this.boardRendererSubject.next(boardRenderer);
  }

  createTile() {
    this.createTileTriggerSubject.next();
  }

  refreshTiles() {
    this.refreshTilesSubject.next();
  }

  setSelectedTileId(tileId: string | null) {
    this.boardState.next({
      selectedTileId: tileId,
    });
  }

  updateTilePosition(tileId: string, x: number, y: number) {
    this.updateSelectedTileSubject.next({
      id: tileId,
      x,
      y,
    });
  }

  resetCanvas() {
    this.resetCanvasSubject.next();
  }
}
