import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BoardCanvasModule } from '../board-canvas/board-canvas.module';
import { BoardModule } from '../board/board.module';
import { BackgroundImageRenderer } from '../board/renderers/background-image-renderer';
import { GridRenderer } from '../board/renderers/grid-renderer';
import { BoardService } from '../board/board.service';
import { ReadonlyTileRenderer } from '../board/renderers/readonly-tile-renderer';
import { PublicEventInfoComponent } from '../public-event-info/public-event-info.component';

@Component({
  selector: 'app-public-event',
  templateUrl: './public-event.component.html',
  styleUrls: ['./public-event.component.scss'],
  standalone: true,
  imports: [BoardCanvasModule, BoardModule, PublicEventInfoComponent],
})
export class PublicEventComponent implements OnInit, OnDestroy {
  private readonly boardService = inject(BoardService);

  private readonly INITIAL_BOARD_RENDERERS = [
    new BackgroundImageRenderer(),
    new GridRenderer(),
    new ReadonlyTileRenderer(),
  ];

  ngOnInit(): void {
    this.INITIAL_BOARD_RENDERERS.forEach((renderer, index) =>
      this.boardService.registerRenderer(renderer, index)
    );
  }

  ngOnDestroy(): void {
    this.boardService.unregisterAllRenderers();
  }
}
