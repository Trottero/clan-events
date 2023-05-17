import { NgModule } from '@angular/core';
import { ClanListComponent } from './modules/clan-list/clan-list.component';
import { CreateClanComponent } from './modules/create-clan/create-clan.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthModule } from '../../shared/auth/auth.module';
import { ClanOverviewComponent } from './modules/clan-overview/clan-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApplyToClanComponent } from './modules/apply-to-clan/apply-to-clan.component';
import { AddClanComponent } from './modules/add-clan/add-clan.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AsyncClanNameValidator } from './validators/async-clan-name.validator';
import { ClanApplicationsComponent } from './modules/clan-applications/clan-applications.component';
import { ClanApplicationApiService } from './services/clan-application.api.service';
import { EditClanComponent } from './modules/edit-clan/edit-clan.component';
import { ManageClanComponent } from './modules/manage-clan/manage-clan.component';
import { MatTabsModule } from '@angular/material/tabs';
import { authGuard } from 'src/app/shared/auth/auth.guard';

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
    MatTabsModule,
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
        path: ':clanName/manage',
        component: ManageClanComponent,
      },
      {
        path: ':clanName/manage/applications',
        component: ClanApplicationsComponent,
      },
      {
        path: ':clanName/manage/members',
        component: EditClanComponent,
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
    EditClanComponent,
    ManageClanComponent,
  ],
})
export class ClanModule {}
