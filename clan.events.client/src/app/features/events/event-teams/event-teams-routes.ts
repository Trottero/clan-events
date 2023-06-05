import { Route } from '@angular/router';
import { EventTeamsListComponent } from './event-teams-list/event-teams-list.component';
import { EventTeamsDetailComponent } from './event-teams-detail/event-teams-detail.component';

export const EventTeamsRoutes: Route[] = [
  {
    path: '',
    component: EventTeamsListComponent,
  },
  {
    path: ':teamId',
    component: EventTeamsDetailComponent,
  },
];
