import { Component, inject } from '@angular/core';
import { EventTeamsService } from '../event-teams.service';
import { EventIdStream } from '../../streams/event-id.stream';
import { SelectedClanService } from 'src/app/features/clan/services/selected-clan.service';
import { combineLatest, shareReplay, switchMap, take } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { notNullOrUndefined } from 'src/app/core/common/operators/not-undefined';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-teams-list',
  templateUrl: './event-teams-list.component.html',
  styleUrls: ['./event-teams-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class EventTeamsListComponent {
  private readonly eventTeamService = inject(EventTeamsService);
  private readonly eventStream$ = inject(EventIdStream).pipe(
    notNullOrUndefined()
  );

  private readonly selectedClanName$ = inject(
    SelectedClanService
  ).selectedClanName$.pipe(notNullOrUndefined());

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  eventTeams$ = combineLatest([this.eventStream$, this.selectedClanName$]).pipe(
    switchMap(([eventId, clanName]) =>
      this.eventTeamService.getTeams(clanName, eventId)
    ),
    shareReplay(1)
  );

  navigateToTeam(teamId: string) {
    combineLatest([this.eventStream$, this.selectedClanName$])
      .pipe(take(1))
      .subscribe(([eventId, clanName]) =>
        this.router.navigate([teamId], {
          relativeTo: this.route,
        })
      );
  }

  deleteTeam(teamId: string) {
    combineLatest([this.eventStream$, this.selectedClanName$])
      .pipe(
        take(1),
        switchMap(([eventId, clanName]) =>
          this.eventTeamService.deleteTeam(clanName, eventId, teamId)
        )
      )
      .subscribe();
  }
}
