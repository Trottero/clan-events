import { Route } from '@angular/router';
import { EventTeamsListComponent } from './event-teams-list/event-teams-list.component';

export const EventTeamsRoutes: Route[] = [
  {
    path: '',
    component: EventTeamsListComponent,
  },
];
