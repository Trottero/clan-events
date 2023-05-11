import { NgModule } from '@angular/core';
import { EventsComponent } from './events.component';
import { Route, RouterModule } from '@angular/router';
import { NAVIGATION_PARAMS, NAVIGATION_PATHS } from 'src/app/config/navigation';

const ROUTES: Route[] = [
  {
    path: ``,
    component: EventsComponent,
  },
  {
    path: `${NAVIGATION_PATHS.EVENTS_CREATE}`,
    loadChildren: () =>
      import('./modules/create-event/create-event.module').then(
        m => m.CreateEventModule
      ),
  },
  {
    path: `:${NAVIGATION_PARAMS.ID}/${NAVIGATION_PATHS.EVENTS_EDIT}`,
    loadChildren: () =>
      import('./modules/edit-event/edit-event.module').then(
        m => m.EditEventModule
      ),
  },
  {
    path: `:${NAVIGATION_PARAMS.ID}`,
    loadChildren: () =>
      import('./modules/event/event.module').then(m => m.EventModule),
  },
  {
    path: '**',
    component: EventsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
