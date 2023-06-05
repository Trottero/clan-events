import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TileChallengesComponent } from './tile-challenges.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsLoadingPipe } from '../../../../core/common/pipes/is-loading.pipe';
import { IsSuccessPipe } from '../../../../core/common/pipes/is-success.pipe';
import { MatButtonModule } from '@angular/material/button';
import { TileChallengeItemModule } from '../tile-challenge-item/tile-challenge-item.module';

@NgModule({
  declarations: [TileChallengesComponent],
  exports: [TileChallengesComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    IsLoadingPipe,
    IsSuccessPipe,
    TileChallengeItemModule,
  ],
})
export class TileChallengesModule {}
