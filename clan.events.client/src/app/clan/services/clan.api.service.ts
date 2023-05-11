import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { ClanMemberResponse, ClanResponse, ClanWithRole } from '@common/clan';
import { HttpClient } from '@angular/common/http';
import { Response } from '@common/responses';
import { ConfigService } from 'src/app/config/config.service';
import { ClanRole } from '@common/auth/clan.role';

@Injectable({
  providedIn: 'root',
})
export class ClanApiService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService
  ) {}

  getClans(): Observable<ClanWithRole[]> {
    return this.httpClient
      .get<Response<ClanWithRole[]>>(`${this.configService.backEndUrl}/clan`)
      .pipe(map(x => x.data));
  }

  getClan(clanName: string): Observable<ClanResponse> {
    return this.httpClient
      .get<Response<ClanResponse>>(
        `${this.configService.backEndUrl}/clan/${clanName}/`
      )
      .pipe(map(x => x.data));
  }

  createClan(clanName: string): Observable<ClanResponse> {
    return this.httpClient
      .post<Response<ClanResponse>>(`${this.configService.backEndUrl}/clan/`, {
        name: clanName,
      })
      .pipe(map(x => x.data));
  }

  clanExists(clanName: string): Observable<boolean> {
    return this.getClan(clanName).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  deleteClan(clanName: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.configService.backEndUrl}/clan/${clanName}/`
    );
  }

  addMember(clanName: string, clanRole: ClanRole, discordId: number) {
    return this.httpClient
      .post<Response<ClanMemberResponse>>(
        `${this.configService.backEndUrl}/clan/${clanName}/members`,
        {
          discordId,
          clanRole,
        }
      )
      .pipe(map(x => x.data));
  }

  removeMember(clanName: string, discordId: number) {
    return this.httpClient
      .delete<Response<void>>(
        `${this.configService.backEndUrl}/clan/${clanName}/members`,
        {
          body: {
            discordId,
          },
        }
      )
      .pipe(map(x => x.data));
  }

  updateMember(clanName: string, clanRole: ClanRole, discordId: number) {
    return this.httpClient
      .patch<Response<ClanMemberResponse>>(
        `${this.configService.backEndUrl}/clan/${clanName}/members`,
        {
          discordId,
          clanRole,
        }
      )
      .pipe(map(x => x.data));
  }
}
