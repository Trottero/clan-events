import { Component, inject } from '@angular/core';
import {
  Subject,
  catchError,
  combineLatest,
  map,
  merge,
  of,
  share,
  shareReplay,
  switchMap,
  tap,
  timer,
  withLatestFrom,
} from 'rxjs';
import { SelectedClanService } from '../../services/selected-clan.service';
import { ClanApiService } from '../../services/clan.api.service';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { UserService } from 'src/app/shared/user/user.service';
import { ClanMemberResponse } from '@common/clan';
import { ClanRole } from '@common/auth/clan.role';
import { SnackbarService } from 'src/app/core/components/snackbar/snackbar.service';

@Component({
  selector: 'app-edit-clan',
  templateUrl: './edit-clan.component.html',
  styleUrls: ['./edit-clan.component.scss'],
})
export class EditClanComponent {
  private readonly selectedClanService = inject(SelectedClanService);
  private readonly clanApiService = inject(ClanApiService);
  private readonly userService = inject(UserService);
  private readonly snackbarService = inject(SnackbarService);

  roleEnum = ClanRole;
  clanRoles = Object.values(ClanRole);

  activeClan$ = this.selectedClanService.selectedClan$.pipe(
    notNullOrUndefined(),
    shareReplay(1)
  );

  role$ = this.activeClan$.pipe(map(x => x.role));

  discordId$ = this.userService.userState$.pipe(map(x => x.discordId));

  kickUserTrigger$ = new Subject<ClanMemberResponse>();
  kickUser$ = this.kickUserTrigger$.pipe(
    withLatestFrom(this.activeClan$),
    switchMap(([clanMember, clan]) =>
      this.clanApiService.removeMember(clan.name, clanMember.discordId).pipe(
        tap(() =>
          this.snackbarService.success(`${clanMember.name} has been kicked.`)
        ),
        catchError(() => {
          this.snackbarService.error(
            `Failed to kick ${clanMember.name} - Refresh the page and try again.`
          );
          return of(null);
        })
      )
    ),
    share()
  );

  promoteUserTrigger$ = new Subject<ClanMemberResponse>();

  promoteUser$ = this.promoteUserTrigger$.pipe(
    withLatestFrom(this.activeClan$),
    switchMap(([data, clan]) =>
      this.clanApiService
        .updateMember(clan.name, data.clanRole, data.discordId)
        .pipe(
          tap(() =>
            this.snackbarService.success(
              `${data.name} has been promoted to ${data.clanRole}.`
            )
          ),
          catchError(() => {
            this.snackbarService.error(`Failed to promote ${data.name}.`);
            return of(null);
          })
        )
    ),
    share()
  );

  // Auto refresh every 10 seconds, or when the user does an action
  retrieveClan$ = merge(timer(0, 1000 * 10), this.kickUser$, this.promoteUser$);

  clan$ = combineLatest([
    this.retrieveClan$,
    this.activeClan$.pipe(map(state => state.name)),
  ]).pipe(switchMap(([_, clanName]) => this.clanApiService.getClan(clanName)));

  isAllowedToEdit(selfRole: ClanRole, other: ClanRole): boolean {
    if (selfRole === ClanRole.Owner) {
      return other !== ClanRole.Owner;
    }
    return selfRole === ClanRole.Admin && other === ClanRole.Member;
  }

  promoteUser(member: ClanMemberResponse, role: ClanRole) {
    this.promoteUserTrigger$.next({ ...member, clanRole: role });
  }

  kickUser(member: ClanMemberResponse) {
    this.kickUserTrigger$.next(member);
  }
}
