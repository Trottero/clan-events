import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterComponent } from './pages/counter/counter.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CodeRedirectComponent } from './auth/components/code-redirect/code-redirect.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EventsModule } from './pages/events/events.module';
import { SnackbarTestComponent } from './common/snackbar/snackbar-test/snackbar-test.component';
import { NAVIGATION_PARAMS, NAVIGATION_PATHS } from './config/navigation';
import { authGuard } from './auth/auth.guard';

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
  },
  {
    path: `:${NAVIGATION_PARAMS.CLAN_NAME}/${NAVIGATION_PATHS.EVENTS}`,
    loadChildren: () =>
      import('./pages/events/events.module').then(m => m.EventsModule),
    canActivate: [authGuard],
  },
  {
    path: 'clan',
    loadChildren: () => import('./clan/clan.module').then(m => m.ClanModule),
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
