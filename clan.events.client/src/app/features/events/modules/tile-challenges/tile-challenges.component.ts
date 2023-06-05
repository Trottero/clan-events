import { Component, inject } from '@angular/core';
import { BoardService } from '../board/board.service';
import { TileChallengesService } from './tile-challenges.service';

@Component({
  selector: 'app-tile-challenges',
  templateUrl: './tile-challenges.component.html',
  styleUrls: ['./tile-challenges.component.scss'],
})
export class TileChallengesComponent {
  private tileChallengesService = inject(TileChallengesService);

  selectedTile$ = inject(BoardService).selectedTile$;

  challenges$ = this.tileChallengesService.challenges$;

  createChallenge() {
    this.tileChallengesService.createChallenge({
      description: 'Description',
    });
  }
}
