import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardCanvasComponent } from './board-canvas.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [BoardCanvasComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [BoardCanvasComponent],
})
export class BoardCanvasModule {}
