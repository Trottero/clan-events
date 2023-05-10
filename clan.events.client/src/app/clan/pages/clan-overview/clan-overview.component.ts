import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ClanService } from '../../services/clan.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  Subscription,
  catchError,
  combineLatest,
  filter,
  map,
  merge,
  of,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ClanMemberResponse } from '@common/clan';
import { ClanRole } from '@common/auth/clan.role';
import { UserService } from 'src/app/user/user.service';
import { MatTable } from '@angular/material/table';

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

  discordId$ = this.userService.userState$.pipe(map(x => x.discordId));

  role$ = combineLatest([this.clan$, this.discordId$]).pipe(
    map(([clan, discordId]) => {
      return (
        clan.members.find(x => x.discordId === discordId)?.clanRole ??
        ClanRole.Member
      );
    })
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
      this.clanMembers = JSON.parse(JSON.stringify(x.members));
      this.clanDisplayName = x.displayName;
    })
  );

  clanRoles = Object.values(ClanRole);
  roleEnum = ClanRole;

  private readonly _subscription = new Subscription();

  // Please forgive me.
  @ViewChild(MatTable) table: MatTable<ClanMemberResponse> | undefined;

  constructor(
    private readonly clanService: ClanService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly changeDetectorRef: ChangeDetectorRef
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
          x =>
            !clan.members.some(y => y.discordId === x.discordId) &&
            x.discordId > 0
        );

        const membersToRemove = clan.members.filter(
          x => !this.clanMembers.some(y => y.discordId === x.discordId)
        );

        const membersToUpdate = this.clanMembers.filter(x =>
          clan.members.some(
            y => y.discordId === x.discordId && y.clanRole !== x.clanRole
          )
        );

        return combineLatest([
          of(clan),
          ...membersToAdd.map(x =>
            this.clanService
              .addMember(clan.name, x.clanRole, x.discordId)
              .pipe(catchError(err => of(null)))
          ),
          ...membersToRemove.map(x =>
            this.clanService
              .removeMember(clan.name, x.discordId)
              .pipe(catchError(err => of(null)))
          ),
          ...membersToUpdate.map(x =>
            this.clanService
              .updateMember(clan.name, x.clanRole, x.discordId)
              .pipe(catchError(err => of(null)))
          ),
        ]);
      }),
      tap(([clan]) => this.retrieveClan$.next(clan.name)),
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

  addMember() {
    this.clanMembers.push({
      name: 'Name will be updated on save',
      discordId: 0,
      clanRole: ClanRole.Member,
    });
    this.table!.renderRows();
  }

  isAllowedToEdit(selfRole: ClanRole, other: ClanRole): boolean {
    if (selfRole === ClanRole.Owner) {
      return other !== ClanRole.Owner;
    }
    return selfRole === ClanRole.Admin && other === ClanRole.Member;
  }
}
