import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';

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
          import('./modules/event/event.module').then((m) => m.EventModule),
      },
      {
        path: '**',
        component: EventsComponent,
      },
    ]),
  ],
})
export class EventsModule {}
