import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { EventTeamsService } from '../event-teams.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  Subject,
  combineLatest,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { EventIdStream } from '../../streams/event-id.stream';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import { EventTeamMemberResponse } from '@common/events/responses/event-team-member.response';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ClanApiService } from 'src/app/features/clan/services/clan.api.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-event-teams-detail',
  templateUrl: './event-teams-detail.component.html',
  styleUrls: ['./event-teams-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
})
export class EventTeamsDetailComponent {
  private readonly eventTeamsService = inject(EventTeamsService);
  private readonly eventStream$ = inject(EventIdStream).pipe(
    notNullOrUndefined(),
    shareReplay(1)
  );

  private readonly clanApiService = inject(ClanApiService);

  private readonly selectedClanService = inject(SelectedClanService);

  private readonly selectedClanName$ =
    this.selectedClanService.selectedClanName$.pipe(
      notNullOrUndefined(),
      shareReplay(1)
    );

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  teamId$ = this.route.paramMap.pipe(
    map(params => params.get('teamId')),
    notNullOrUndefined(),
    shareReplay(1)
  );

  clanMembers$ = this.selectedClanName$.pipe(
    switchMap(clanName => this.clanApiService.getClan(clanName)),
    map(clan => clan.members),
    shareReplay(1)
  );

  searchTermControl = new FormControl<string | EventTeamMemberResponse>('');

  searchTerm$ = this.searchTermControl.value$.pipe(shareReplay(1));

  clanMemberOptions$ = combineLatest([
    this.clanMembers$,
    this.searchTerm$,
  ]).pipe(
    map(([members, searchTerm]) => {
      const term =
        typeof searchTerm === 'string' ? searchTerm : searchTerm.name;
      return members.filter(member =>
        member.name.toLowerCase().includes(term.toLowerCase())
      );
    })
  );

  teamName = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  formGroup = new FormGroup({
    teamName: this.teamName,
  });

  team$ = combineLatest([
    this.eventStream$,
    this.selectedClanName$,
    this.teamId$,
  ]).pipe(
    switchMap(([eventId, clanName, teamId]) =>
      teamId != 'new'
        ? this.eventTeamsService.getTeam(clanName, eventId, teamId!)
        : of({
            id: '',
            name: '',
            members: [],
          })
    ),
    tap(team => {
      this.teamName.setValue(team.name);
      this.teamMembers = team.members;
    })
  );

  teamMembers: EventTeamMemberResponse[] = [];

  updateTeamTrigger$ = new Subject<void>();

  updateTeam$ = combineLatest([
    this.eventStream$,
    this.selectedClanName$,
    this.teamId$,
    this.updateTeamTrigger$,
  ]).pipe(
    switchMap(([eventId, clanName, teamId, _]) =>
      teamId != 'new'
        ? this.eventTeamsService.updateTeam(clanName, eventId, teamId!, {
            name: this.teamName.value,
            members: this.teamMembers.map(member => member.id),
          })
        : this.eventTeamsService
            .createTeam(clanName, eventId, this.teamName.value)
            .pipe(
              switchMap(team =>
                this.router.navigate(['../', team.id], {
                  relativeTo: this.route,
                })
              )
            )
    )
  );

  @ViewChild('table') table?: MatTable<EventTeamMemberResponse>;

  submitTeam() {
    this.updateTeamTrigger$.next();
  }

  removeMember(member: EventTeamMemberResponse) {
    this.teamMembers = this.teamMembers.filter(m => m.id != member.id);
    this.updateTeamTrigger$.next();
  }

  addMember() {
    if (
      !this.searchTermControl.value ||
      typeof this.searchTermControl.value === 'string'
    ) {
      return;
    }

    this.teamMembers.push({
      ...(this.searchTermControl.value as EventTeamMemberResponse),
    });
    this.searchTermControl.setValue('');
    this.table?.renderRows();
    this.table?.updateStickyFooterRowStyles();
    this.updateTeamTrigger$.next();
  }

  displayFn(teamMember: EventTeamMemberResponse): string {
    return teamMember?.name ? teamMember.name : '';
  }
}
