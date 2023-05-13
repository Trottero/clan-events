import { Component, OnDestroy, inject } from '@angular/core';
import { catchError } from 'rxjs';
import { BoardService } from './board.service';
import { SimpleBoardRenderer } from './simple-board-renderer';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy {
  private readonly boardService = inject(BoardService);

  tiles$ = this.boardService.tiles$.pipe(
    catchError(err => {
      console.error(err.message);
      return [];
    })
  );

  selectedTile$ = this.boardService.selectedTile$;

  boardRenderer = new SimpleBoardRenderer();

  ngOnInit(): void {
    this.boardService.setBoardRenderer(this.boardRenderer);
  }

  ngOnDestroy(): void {
    this.boardRenderer.destroy();
    this.boardService.setBoardRenderer(null);
  }

  createTile() {
    this.boardService.createTile();
  }

  resetCanvas() {
    this.boardService.resetCanvas();
  }
}
