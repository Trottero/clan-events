import { NgModule } from '@angular/core';
import { EventsComponent } from './events.component';
import { Route, RouterModule } from '@angular/router';
import {
  NAVIGATION_PARAMS,
  NAVIGATION_PATHS,
} from 'src/app/core/config/navigation';

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
    path: `:${NAVIGATION_PARAMS.EVENT_ID}/${NAVIGATION_PATHS.EVENTS_EDIT}`,
    loadChildren: () =>
      import('./modules/edit-event/edit-event.module').then(
        m => m.EditEventModule
      ),
  },
  {
    path: `:${NAVIGATION_PARAMS.EVENT_ID}/${NAVIGATION_PATHS.EVENTS_TEAMS}`,
    loadChildren: () =>
      import('./event-teams/event-teams-routes').then(m => m.EventTeamsRoutes),
  },
  {
    path: `:${NAVIGATION_PARAMS.EVENT_ID}/public`,
    loadComponent: () =>
      import('./modules/board-public/board-public.component').then(
        m => m.BoardPublicComponent
      ),
  },
  {
    path: `:${NAVIGATION_PARAMS.EVENT_ID}`,
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
