import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { BoardApiService } from './board.api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsLoadingPipe } from '../../../../core/common/pipes/is-loading.pipe';
import { IsSuccessPipe } from '../../../../core/common/pipes/is-success.pipe';
import { MatButtonModule } from '@angular/material/button';
import { BoardCanvasModule } from '../board-canvas/board-canvas.module';
import { BoardService } from './board.service';
import { EditTileModule } from '../edit-tile/edit-tile.module';
import { FileInputComponent } from 'src/app/core/components/file-input/file-input.component';
import { TileChallengesModule } from '../tile-challenges/tile-challenges.module';

@NgModule({
  declarations: [BoardComponent],
  providers: [],
  exports: [BoardComponent],
  imports: [
    CommonModule,
    IsLoadingPipe,
    IsSuccessPipe,

    EditTileModule,
    BoardCanvasModule,
    TileChallengesModule,
    FileInputComponent,

    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class BoardModule {}
