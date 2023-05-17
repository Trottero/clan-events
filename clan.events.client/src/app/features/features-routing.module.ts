import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SnackbarTestComponent } from '../core/components/snackbar/snackbar-test/snackbar-test.component';
import { NAVIGATION_PARAMS, NAVIGATION_PATHS } from '../core/config/navigation';
import { authGuard } from '../shared/auth/auth.guard';
import { CodeRedirectComponent } from '../shared/auth/modules/code-redirect/code-redirect.component';
import { CounterComponent } from './counter/counter.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'counter',
    component: CounterComponent,
  },
  {
    path: 'code',
    component: CodeRedirectComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: `:${NAVIGATION_PARAMS.CLAN_NAME}/${NAVIGATION_PATHS.EVENTS}`,
    loadChildren: () =>
      import('./events/events.module').then(m => m.EventsModule),
    canActivate: [authGuard],
  },
  {
    path: 'clan',
    loadChildren: () => import('./clan/clan.module').then(m => m.ClanModule),
    canActivate: [authGuard],
  },
  {
    path: 'test/snackbar',
    component: SnackbarTestComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule {}
