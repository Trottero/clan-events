import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from './counter/counter.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { FeaturesRoutingModule } from './features-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    NotFoundComponent,
    CounterComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, FeaturesRoutingModule],
})
export class FeaturesModule {}
