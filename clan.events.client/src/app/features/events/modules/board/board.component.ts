import {
  Component,
  EnvironmentInjector,
  OnDestroy,
  inject,
} from '@angular/core';
import { BoardService } from './board.service';
import { TileRenderer } from './renderers/tile-renderer';
import { GridRenderer } from './renderers/grid-renderer';
import { BackgroundImageRenderer } from './renderers/background-image-renderer';
import { map, take } from 'rxjs';

const BOARD_RENDERER_PRIORITY = {
  [BackgroundImageRenderer.name]: 0,
  [GridRenderer.name]: 1,
  [TileRenderer.name]: 2,
};

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy {
  private readonly boardService = inject(BoardService);
  private readonly environmentInjector = inject(EnvironmentInjector);

  private readonly INITIAL_BOARD_RENDERERS = [
    new BackgroundImageRenderer(),
    new GridRenderer(),
    new TileRenderer(),
  ];

  tiles$ = this.boardService.tiles$;

  selectedTile$ = this.boardService.selectedTile$;

  backgroundImage$ = this.boardService.backgroundImageUri$;

  renderers$ = this.boardService.renderers$;

  ngOnInit(): void {
    this.INITIAL_BOARD_RENDERERS.forEach(renderer =>
      this.boardService.registerRenderer(
        renderer,
        BOARD_RENDERER_PRIORITY[renderer.constructor.name]
      )
    );
  }

  ngOnDestroy(): void {
    this.boardService.unregisterAllRenderers();
  }

  createTile() {
    this.boardService.createTile();
  }

  resetCanvas() {
    this.boardService.resetCanvas();
  }

  onFileSelected(file: File) {
    this.boardService.updateBackground(file);
  }

  toggleGrid() {
    this.boardService.isGridEnabled$.pipe(take(1)).subscribe(isEnabled => {
      if (isEnabled) {
        this.boardService.unregisterRenderer(GridRenderer.name);
      } else {
        this.boardService.registerRenderer(
          this.environmentInjector.runInContext(() => new GridRenderer()),
          BOARD_RENDERER_PRIORITY[GridRenderer.name]
        );
      }
    });
  }
}
