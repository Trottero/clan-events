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

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        loadChildren: () =>
          import('./features/features.module').then(m => m.FeaturesModule),
      },
    ]),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
