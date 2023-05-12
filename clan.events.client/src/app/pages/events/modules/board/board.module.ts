import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { BoardApiService } from './board.api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsLoadingPipe } from '../../../../common/pipes/is-loading.pipe';
import { IsSuccessPipe } from '../../../../common/pipes/is-success.pipe';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [BoardComponent],
  providers: [BoardApiService],
  exports: [BoardComponent],
  imports: [
    CommonModule,
    IsLoadingPipe,
    IsSuccessPipe,

    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class BoardModule {}
