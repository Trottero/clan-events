import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { BoardApiService } from './board.api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsLoadingPipe } from '../../../../common/pipes/is-loading.pipe';
import { IsSuccessPipe } from '../../../../common/pipes/is-success.pipe';
import { MatButtonModule } from '@angular/material/button';
import { BoardCanvasModule } from '../board-canvas/board-canvas.module';
import { BoardService } from './board.service';

@NgModule({
  declarations: [BoardComponent],
  providers: [],
  exports: [BoardComponent],
  imports: [
    CommonModule,
    IsLoadingPipe,
    IsSuccessPipe,

    BoardCanvasModule,

    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class BoardModule {}
