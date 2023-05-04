import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventComponent } from './event.component';
import { RouterModule } from '@angular/router';

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
  ],
})
export class EventModule {}
