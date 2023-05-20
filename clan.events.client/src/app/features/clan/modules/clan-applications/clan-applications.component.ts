import { Component, ViewChild, inject } from '@angular/core';
import { ClanApplicationApiService } from '../../services/clan-application.api.service';
import { SelectedClanService } from '../../services/selected-clan.service';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import {
  Subject,
  distinctUntilChanged,
  map,
  merge,
  share,
  shareReplay,
  switchMap,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { MatTable } from '@angular/material/table';
import { ClanApplication } from '@common/clan';
import { SnackbarService } from 'src/app/core/components/snackbar/snackbar.service';

@Component({
  selector: 'app-clan-applications',
  templateUrl: './clan-applications.component.html',
  styleUrls: ['./clan-applications.component.scss'],
})
export class ClanApplicationsComponent {
  private readonly clanApplicationApiService = inject(
    ClanApplicationApiService
  );

  private readonly selectedClanService = inject(SelectedClanService);

  private readonly snackbarService = inject(SnackbarService);

  private readonly triggerClanRefresh$ = timer(0, 1000 * 5);

  @ViewChild(MatTable) table: MatTable<ClanApplication> | undefined;

  clanName$ = this.selectedClanService.selectedClanName$.pipe(
    notNullOrUndefined(),
    shareReplay(1)
  );

  deleteUserApplicationTrigger$ = new Subject<string>();
  deleteUserApplication$ = this.deleteUserApplicationTrigger$.pipe(
    withLatestFrom(this.clanName$),
    switchMap(([discordId, clanName]) =>
      this.clanApplicationApiService.deleteApplication(clanName, discordId)
    ),
    tap(x => this.snackbarService.success(`User has been removed.`)),
    share()
  );

  approveUserApplicationTrigger$ = new Subject<string>();
  approveUserApplication$ = this.approveUserApplicationTrigger$.pipe(
    withLatestFrom(this.clanName$),
    switchMap(([discordId, clanName]) =>
      this.clanApplicationApiService.approveApplication(clanName, discordId)
    ),
    tap(x =>
      this.snackbarService.success(`${x.name} is now part of of your clan!`)
    ),
    share()
  );

  applications$ = merge(
    this.deleteUserApplication$,
    this.approveUserApplication$,
    this.triggerClanRefresh$
  ).pipe(
    withLatestFrom(this.clanName$),
    switchMap(([_, name]) =>
      this.clanApplicationApiService.getApplicationsForClan(name)
    ),
    tap(() => this.table?.renderRows()),
    distinctUntilChanged(),
    share()
  );

  hasApplications$ = this.applications$.pipe(map(x => x.length > 0));
}
