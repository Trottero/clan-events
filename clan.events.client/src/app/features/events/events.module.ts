import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventsService } from './events.service';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EventsRoutingModule } from './events-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsLoadingPipe } from '../../core/common/pipes/is-loading.pipe';
import { IsSuccessPipe } from '../../core/common/pipes/is-success.pipe';
import { EventTeamsService } from './event-teams/event-teams.service';

@NgModule({
  declarations: [EventsComponent],
  providers: [EventsService, EventTeamsService],
  imports: [
    CommonModule,
    EventsRoutingModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    IsLoadingPipe,
    IsSuccessPipe,
  ],
})
export class EventsModule {}
