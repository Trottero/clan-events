import { Injectable, inject } from '@angular/core';
import {
  combineLatest,
  startWith,
  switchMap,
  shareReplay,
  Subject,
  Subscription,
  withLatestFrom,
  map,
} from 'rxjs';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import {
  filterMapSuccess,
  mapToLoadable,
} from 'src/app/core/common/operators/loadable';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { BoardApiService } from './board.api.service';
import { EventIdStream } from '../../streams/event-id.stream';
import { State } from 'src/app/core/common/observable/state';
import { TileResponse } from '@common/events';
import { BoardRenderer } from './renderers/board-renderer';
import { RendererPriorityMap } from 'src/app/features/events/modules/board/renderers/renderer-priority-map';
import { GridRenderer } from './renderers/grid-renderer';

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
  private readonly updateBackgroundSubject = new Subject<File>();

  private readonly renderersSubject = new RendererPriorityMap();

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

  renderers$ = this.renderersSubject.renderers$;

  isGridEnabled$ = this.renderers$.pipe(
    map(renderers =>
      renderers.some(renderer => renderer instanceof GridRenderer)
    )
  );

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

  updateBackgroundImage$ = this.updateBackgroundSubject.pipe(
    withLatestFrom(
      this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
      this.eventId$.pipe(notNullOrUndefined())
    ),
    switchMap(([file, clan, eventId]) =>
      this.boardApiService.updateBackground(clan.name, eventId, file)
    )
  );

  backgroundImageUri$ = combineLatest([
    this.updateBackgroundImage$.pipe(startWith(undefined)),
    this.selectedClanService.selectedClan$.pipe(notNullOrUndefined()),
    this.eventId$.pipe(notNullOrUndefined()),
  ]).pipe(
    switchMap(([_, clan, eventId]) =>
      this.boardApiService.getBackground(clan.name, eventId)
    ),
    map(blob => {
      const urlCreator = window.URL || window.webkitURL;
      return urlCreator.createObjectURL(blob);
    }),
    shareReplay(1)
  );

  constructor() {
    this.subscriptions.add(
      this.createTileTrigger$.subscribe(() => this.refreshTilesSubject.next())
    );

    this.subscriptions.add(this.updateSelectedTile$.subscribe());
    this.subscriptions.add(this.updateBackgroundImage$.subscribe());
  }

  registerRenderer(boardRenderer: BoardRenderer, priority: number) {
    this.renderersSubject.set(boardRenderer.name, boardRenderer, priority);
  }

  unregisterRenderer(name: string) {
    this.renderersSubject.delete(name);
  }

  unregisterAllRenderers() {
    this.renderersSubject.clear();
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

  updateBackground(file: File) {
    this.updateBackgroundSubject.next(file);
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
