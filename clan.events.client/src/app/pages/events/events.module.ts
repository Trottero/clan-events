import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';
import { EventsService } from './events.service';

@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,

    RouterModule.forChild([
      {
        path: '',
        component: EventsComponent,
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./modules/event/event.module').then(m => m.EventModule),
      },
      {
        path: '**',
        component: EventsComponent,
      },
    ]),
  ],
  providers: [EventsService],
})
export class EventsModule {}
