import { Component, inject } from '@angular/core';
import { SelectedClanService } from '../../services/selected-clan.service';
import { ClanApiService } from '../../services/clan.api.service';
import { Router } from '@angular/router';
import { catchError, of, shareReplay, switchMap, tap } from 'rxjs';
import { ClansService } from '../../services/clans.service';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { ClanRole } from '@common/auth/clan.role';
import { SnackbarService } from 'src/app/core/components/snackbar/snackbar.service';

@Component({
  selector: 'app-manage-clan',
  templateUrl: './manage-clan.component.html',
  styleUrls: ['./manage-clan.component.scss'],
})
export class ManageClanComponent {
  private readonly selectedClanService = inject(SelectedClanService);
  private readonly clansService = inject(ClansService);
  private readonly router = inject(Router);
  private readonly snackbarService = inject(SnackbarService);
  private readonly clanApiService = inject(ClanApiService);

  roleEnum = ClanRole;

  selectedClan$ = this.selectedClanService.selectedClan$.pipe(
    notNullOrUndefined(),
    shareReplay(1)
  );

  deleteClan() {
    this.selectedClan$
      .pipe(
        switchMap(clan =>
          this.clanApiService.deleteClan(clan.name).pipe(
            tap(() =>
              this.snackbarService.success(
                `Clan ${clan.name} has been deleted.`
              )
            ),
            catchError(() => {
              this.snackbarService.error(`Failed to delete clan ${clan.name}.`);
              return of();
            })
          )
        )
      )
      .subscribe(() => {
        this.clansService.refreshClans();
        this.router.navigate(['/clan']);
      });
  }
}
