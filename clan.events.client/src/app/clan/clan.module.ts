import { NgModule } from '@angular/core';
import { ClanListComponent } from './pages/clan-list/clan-list.component';
import { CreateClanComponent } from './pages/create-clan/create-clan.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClanService } from './services/clan.service';
import { AuthModule } from '../auth/auth.module';
import { ClanOverviewComponent } from './pages/clan-overview/clan-overview.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ClanListComponent,
      },
      {
        path: 'new',
        component: CreateClanComponent,
      },
      {
        path: ':clanName',
        component: ClanOverviewComponent,
      },
    ]),
    AuthModule,
  ],
  providers: [ClanService],
  declarations: [ClanListComponent, CreateClanComponent, ClanOverviewComponent],
})
export class ClanModule {}
