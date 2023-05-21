import { Component, OnDestroy, inject } from '@angular/core';
import {
  Subject,
  Subscription,
  catchError,
  combineLatest,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { BoardService } from './board.service';
import { SimpleBoardRenderer } from './renderers/simple-board-renderer';
import { BoardApiService } from './board.api.service';
import { EventIdStream } from '../../streams/event-id.stream';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { GridRenderer } from './renderers/grid-renderer';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import { BackgroundImageRenderer } from './renderers/background-image-renderer';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy {
  private readonly boardService = inject(BoardService);
  private readonly boardApiService = inject(BoardApiService);
  private readonly eventId$ = inject(EventIdStream);
  private readonly selectedClan$ = inject(SelectedClanService).selectedClan$;

  private readonly updateBackgroundSubject = new Subject<File>();
  private readonly subscriptions = new Subscription();

  tiles$ = this.boardService.tiles$;

  selectedTile$ = this.boardService.selectedTile$;

  boardRenderers = [
    new BackgroundImageRenderer(),
    new GridRenderer(),
    new SimpleBoardRenderer(),
  ];

  backgroundImage$ = this.boardService.backgroundImageUri$;

  ngOnInit(): void {
    this.boardService.setBoardRenderers(this.boardRenderers);

    this.subscriptions.add(
      this.updateBackgroundSubject
        .pipe(
          withLatestFrom(
            this.selectedClan$.pipe(notNullOrUndefined()),
            this.eventId$.pipe(notNullOrUndefined())
          ),
          switchMap(([file, clan, eventId]) =>
            this.boardApiService.updateBackground(clan.name, eventId, file)
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.boardRenderers.forEach(x => x.destroy());
    this.boardService.setBoardRenderers([]);
  }

  createTile() {
    this.boardService.createTile();
  }

  resetCanvas() {
    this.boardService.resetCanvas();
  }

  updateBackground(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.updateBackgroundSubject.next(file);
  }
}
