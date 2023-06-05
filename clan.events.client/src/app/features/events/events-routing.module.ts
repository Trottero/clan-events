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
    path: `:${NAVIGATION_PARAMS.EVENT_ID}/${NAVIGATION_PATHS.EVENTS_TEAMS}`,
    loadChildren: () =>
      import('./event-teams/event-teams-routes').then(m => m.EventTeamsRoutes),
  },
  {
    path: `:${NAVIGATION_PARAMS.EVENT_ID}/${NAVIGATION_PATHS.EVENTS_EDIT}`,
    loadComponent: () =>
      import('./modules/event/event.component').then(m => m.EventComponent),
  },
  {
    path: `:${NAVIGATION_PARAMS.EVENT_ID}`,
    loadComponent: () =>
      import('./modules/board-public/public-event.component').then(
        m => m.PublicEventComponent
      ),
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
