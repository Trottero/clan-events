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
import { ToolbarModule } from './components/toolbar/toolbar.module';
import { ConfigModule } from './config/config.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    CounterComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule,
    UserModule,
    BrowserAnimationsModule,
    ToolbarModule,
    ConfigModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
