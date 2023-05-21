import { Component, OnDestroy, inject } from '@angular/core';
import { catchError } from 'rxjs';
import { BoardService } from './board.service';
import { SimpleBoardRenderer } from './renderers/simple-board-renderer';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnDestroy {
  private readonly boardService = inject(BoardService);

  tiles$ = this.boardService.tiles$;

  selectedTile$ = this.boardService.selectedTile$;

  boardRenderers = [new GridRenderer(), new SimpleBoardRenderer()];

  ngOnInit(): void {
    this.boardService.setBoardRenderers(this.boardRenderers);
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
}
