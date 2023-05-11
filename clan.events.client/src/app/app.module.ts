import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CounterComponent } from './pages/counter/counter.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserModule } from './user/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigModule } from './config/config.module';
import { MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { LayoutModule } from './components/layout/layout.module';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { CustomSnackbarComponent } from './shared/snackbar/custom-snackbar/custom-snackbar.component';
import { SnackbarService } from './shared/snackbar/snackbar-service';
import { SnackbarTestComponent } from './shared/snackbar/snackbar-test/snackbar-test.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    CounterComponent,
    ProfileComponent,
    CustomSnackbarComponent,
    SnackbarTestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    UserModule,
    BrowserAnimationsModule,
    ConfigModule,
    LayoutModule,
    MatCommonModule,
    MatButtonModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  providers: [SnackbarService],
  bootstrap: [AppComponent],
})
export class AppModule {}
