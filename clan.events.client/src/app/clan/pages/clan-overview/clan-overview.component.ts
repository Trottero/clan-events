import { Component, inject } from '@angular/core';
import { ClanApiService } from '../../services/clan.api.service';
import {
  Subject,
  combineLatest,
  map,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { ClanRole } from '@common/auth/clan.role';
import { UserService } from 'src/app/user/user.service';
import { SelectedClanService } from '../../services/selected-clan.service';
import { notNullOrUndefined } from 'src/app/common/operators/not-undefined';

@Component({
  selector: 'app-clan-overview',
  templateUrl: './clan-overview.component.html',
  styleUrls: ['./clan-overview.component.scss'],
})
export class ClanOverviewComponent {
  private readonly clanApiService = inject(ClanApiService);
  private readonly userService = inject(UserService);
  private readonly selectedClanService = inject(SelectedClanService);

  activeClan$ = this.selectedClanService.selectedClan$.pipe(
    notNullOrUndefined(),
    shareReplay(1)
  );

  retrieveClan$ = new Subject<string>();

  clan$ = combineLatest([
    this.retrieveClan$.pipe(startWith('')),
    this.activeClan$.pipe(map(state => state.name)),
  ]).pipe(switchMap(([_, clanName]) => this.clanApiService.getClan(clanName)));

  discordId$ = this.userService.userState$.pipe(map(x => x.discordId));

  role$ = combineLatest([this.clan$, this.discordId$]).pipe(
    map(
      ([clan, discordId]) =>
        clan.members.find(x => x.discordId === discordId)?.clanRole ??
        ClanRole.Member
    )
  );

  roleEnum = ClanRole;
}
