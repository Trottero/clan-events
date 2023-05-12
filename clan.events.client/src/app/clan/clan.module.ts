import { NgModule } from '@angular/core';
import { ClanListComponent } from './pages/clan-list/clan-list.component';
import { CreateClanComponent } from './pages/create-clan/create-clan.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../auth/auth.module';
import { ClanOverviewComponent } from './pages/clan-overview/clan-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApplyToClanComponent } from './pages/apply-to-clan/apply-to-clan.component';
import { AddClanComponent } from './pages/add-clan/add-clan.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncClanNameValidator } from './validators/async-clan-name.validator';
import { authGuard } from '../auth/auth.guard';
import { ClanApplicationsComponent } from './pages/clan-applications/clan-applications.component';
import { ClanApplicationApiService } from './services/clan-application.api.service';

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
    MatCardModule,
    MatDividerModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ClanListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'new',
        component: AddClanComponent,
        canActivate: [authGuard],
      },
      {
        path: ':clanName',
        component: ClanOverviewComponent,
      },
      {
        path: ':clanName/applications',
        component: ClanApplicationsComponent,
      },
    ]),
    AuthModule,
  ],
  providers: [AsyncClanNameValidator, ClanApplicationApiService],
  declarations: [
    ClanListComponent,
    CreateClanComponent,
    ClanOverviewComponent,
    ApplyToClanComponent,
    AddClanComponent,
    ClanApplicationsComponent,
  ],
})
export class ClanModule {}
