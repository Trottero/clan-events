import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './features/counter/counter.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { CodeRedirectComponent } from './shared/auth/modules/code-redirect/code-redirect.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NAVIGATION_PARAMS, NAVIGATION_PATHS } from './core/config/navigation';
import { SnackbarTestComponent } from './core/components/snackbar/snackbar-test/snackbar-test.component';
import { authGuard } from './shared/auth/auth.guard';

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
      import('./features/events/events.module').then(m => m.EventsModule),
    canActivate: [authGuard],
  },
  {
    path: 'clan',
    loadChildren: () =>
      import('./features/clan/clan.module').then(m => m.ClanModule),
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
