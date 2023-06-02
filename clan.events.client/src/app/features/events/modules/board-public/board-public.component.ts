import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BoardCanvasModule } from '../board-canvas/board-canvas.module';
import { BoardModule } from '../board/board.module';
import { BackgroundImageRenderer } from '../board/renderers/background-image-renderer';
import { GridRenderer } from '../board/renderers/grid-renderer';
import { TileRenderer } from '../board/renderers/tile-renderer';
import { BoardService } from '../board/board.service';
import { ReadonlyTileRenderer } from '../board/renderers/readonly-tile-renderer';

const BOARD_RENDERER_PRIORITY = {
  [BackgroundImageRenderer.name]: 0,
  [GridRenderer.name]: 1,
  [ReadonlyTileRenderer.name]: 2,
};

@Component({
  selector: 'app-board-public',
  templateUrl: './board-public.component.html',
  styleUrls: ['./board-public.component.scss'],
  standalone: true,
  imports: [BoardCanvasModule, BoardModule],
})
export class BoardPublicComponent implements OnInit, OnDestroy {
  private readonly boardService = inject(BoardService);

  private readonly INITIAL_BOARD_RENDERERS = [
    new BackgroundImageRenderer(),
    new GridRenderer(),
    new ReadonlyTileRenderer(),
  ];

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
}
