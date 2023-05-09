import { Component, OnInit } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  combineLatest,
  filter,
  map,
  merge,
  shareReplay,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ClanMemberResponse } from '@common/clan';
import { ClanRole } from '@common/auth/clan.role';

@Component({
  selector: 'app-clan-overview',
  templateUrl: './clan-overview.component.html',
  styleUrls: ['./clan-overview.component.scss'],
})
export class ClanOverviewComponent implements OnInit {
  allTableColumns = ['clanRole', 'discordId', 'name', 'delete'];

  clanName$ = this.route.params.pipe(
    map(x => x['clanName'] as string),
    shareReplay(1)
  );

  retrieveClan$ = new Subject<string>();

  clan$ = merge(this.clanName$, this.retrieveClan$).pipe(
    filter(x => !!x),
    switchMap(x => this.clanService.getClan(x)),
    shareReplay(1)
  );

  editMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  onExitEditMode$ = new Subject<void>();

  activeTableColumns$ = this.editMode$.pipe(
    map(x =>
      x
        ? this.allTableColumns
        : this.allTableColumns.filter(y => y !== 'delete')
    )
  );

  clanMembers: ClanMemberResponse[] = [];
  clanDisplayName = '';

  createMutationList$ = this.editMode$.pipe(
    filter(x => x),
    switchMap(() => this.clan$),
    tap(x => {
      this.clanMembers = [...x.members];
      this.clanDisplayName = x.displayName;
    })
  );

  clanRoles = Object.values(ClanRole);

  private readonly _subscription = new Subscription();

  constructor(
    private readonly clanService: ClanService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this._subscription.add(this.createMutationList$.subscribe());
    this._subscription.add(this.saveClanFromEdit().subscribe());
  }

  deleteClan() {
    this.clanName$
      .pipe(
        switchMap(name => this.clanService.deleteClan(name)),
        switchMap(() => this.router.navigate(['/clan']))
      )
      .subscribe();
  }

  saveClanFromEdit() {
    return this.onExitEditMode$.pipe(
      withLatestFrom(this.clan$),
      switchMap(([_, clan]) => {
        // Figure out what changed
        const membersToAdd = this.clanMembers.filter(
          x => !clan.members.some(y => y.discordId === x.discordId)
        );

        const membersToRemove = clan.members.filter(
          x => !this.clanMembers.some(y => y.discordId === x.discordId)
        );

        const membersToUpdate = this.clanMembers.filter(x =>
          clan.members.some(y => y.discordId === x.discordId)
        );

        console.log(membersToAdd, membersToRemove, membersToUpdate);

        return combineLatest([
          ...membersToAdd.map(x =>
            this.clanService.addMember(clan.name, x.clanRole, x.discordId)
          ),
          ...membersToRemove.map(x =>
            this.clanService.removeMember(clan.name, x.discordId)
          ),
          ...membersToUpdate.map(x =>
            this.clanService.updateMember(clan.name, x.clanRole, x.discordId)
          ),
        ]);
      }),
      switchMap(() => this.clan$),
      take(1),
      tap(c => this.retrieveClan$.next(c.name)),
      tap(() => this.editMode$.next(false))
    );
  }

  removeMember(member: ClanMemberResponse) {
    this.clanMembers = this.clanMembers.filter(
      x => x.discordId !== member.discordId
    );
  }

  confirmEdit() {
    this.onExitEditMode$.next();
  }

  discardEdit() {
    this.editMode$.next(false);
  }

  enterEditMode() {
    this.editMode$.next(true);
  }
}
