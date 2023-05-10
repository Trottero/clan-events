import { NgModule } from '@angular/core';
import { ClanListComponent } from './pages/clan-list/clan-list.component';
import { CreateClanComponent } from './pages/create-clan/create-clan.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ClanService } from './services/clan.service';
import { AuthModule } from '../auth/auth.module';
import { ClanOverviewComponent } from './pages/clan-overview/clan-overview.component';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
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