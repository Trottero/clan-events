import { Injectable, inject } from '@angular/core';
import { Response } from '@common/responses';
import { EventTeamResponse, UpdateTeamRequest } from '@common/events';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/core/config/config.service';

@Injectable()
export class EventTeamService {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getTeams(clanName: string, eventId: string): Observable<EventTeamResponse[]> {
    return this.http
      .get<Response<EventTeamResponse[]>>(
        `${this.configService.backEndUrl}/${clanName}/events/${eventId}/teams`
      )
      .pipe(map(response => response.data));
  }

  getTeam(
    clanName: string,
    eventId: string,
    teamId: string
  ): Observable<EventTeamResponse> {
    return this.http
      .get<Response<EventTeamResponse>>(
        `${this.configService.backEndUrl}/${clanName}/events/${eventId}/teams/${teamId}`
      )
      .pipe(map(response => response.data));
  }

  createTeam(
    clanName: string,
    eventId: string,
    name: string
  ): Observable<EventTeamResponse> {
    return this.http
      .post<Response<EventTeamResponse>>(
        `${this.configService.backEndUrl}/${clanName}/events/${eventId}/teams`,
        {
          name,
        }
      )
      .pipe(map(response => response.data));
  }

  updateTeam(
    clanName: string,
    eventId: string,
    teamId: string,
    teamRequest: UpdateTeamRequest
  ): Observable<EventTeamResponse> {
    return this.http
      .put<Response<EventTeamResponse>>(
        `${this.configService.backEndUrl}/${clanName}/events/${eventId}/teams/${teamId}`,
        teamRequest
      )
      .pipe(map(response => response.data));
  }

  deleteTeam(
    clanName: string,
    eventId: string,
    teamId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/teams/${teamId}`
    );
  }
}
