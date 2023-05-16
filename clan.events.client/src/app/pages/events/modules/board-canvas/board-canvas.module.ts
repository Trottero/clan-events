import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCanvasComponent } from './board-canvas.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsLoadingPipe } from '../../../../common/pipes/is-loading.pipe';

@NgModule({
  declarations: [BoardCanvasComponent],
  exports: [BoardCanvasComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    IsLoadingPipe,
  ],
})
export class BoardCanvasModule {}
