import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BoardModule } from '../board/board.module';

@NgModule({
  declarations: [EventComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: EventComponent,
      },
    ]),

    BoardModule,

    MatButtonModule,
  ],
})
export class EventModule {}
