import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';
import { EventsService } from './events.service';
import { MatButtonModule } from '@angular/material/button';

const ROUTES = [
  {
    path: '',
    component: EventsComponent,
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./modules/create-event/create-event.module').then(
        m => m.CreateEventModule
      ),
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
];

@NgModule({
  declarations: [EventsComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES), MatButtonModule],
  providers: [EventsService],
})
export class EventsModule {}
