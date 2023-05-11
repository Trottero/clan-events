import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { RouterModule } from '@angular/router';
import { EventsService } from './events.service';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EventsRoutingModule } from './events-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IsLoadingPipe } from '../../common/pipes/is-loading.pipe';
import { IsSuccessPipe } from '../../common/pipes/is-success.pipe';

@NgModule({
  declarations: [EventsComponent],
  providers: [EventsService],
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
