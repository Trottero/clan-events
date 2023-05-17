import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ConfigService } from 'src/app/core/config/config.service';
import { Response } from '@common/responses';
import { ClanApplication, ClanMemberResponse } from '@common/clan';
import { map } from 'rxjs';

@Injectable()
export class ClanApplicationApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly configService = inject(ConfigService);

  getApplicationsForClan(clanName: string) {
    return this.httpClient
      .get<Response<ClanApplication[]>>(
        `${this.configService.backEndUrl}/clan/${clanName}/applications`
      )
      .pipe(map(x => x.data));
  }

  applyToClan(clanName: string) {
    return this.httpClient
      .post<Response<ClanApplication>>(
        `${this.configService.backEndUrl}/clan/${clanName}/applications`,
        {}
      )
      .pipe(map(x => x.data));
  }

  approveApplication(clanName: string, discordId: string) {
    return this.httpClient
      .post<Response<ClanMemberResponse>>(
        `${this.configService.backEndUrl}/clan/${clanName}/applications/approve`,
        { discordId }
      )
      .pipe(map(x => x.data));
  }

  deleteApplication(clanName: string, discordId: string) {
    return this.httpClient.delete<void>(
      `${this.configService.backEndUrl}/clan/${clanName}/applications/`,
      { body: { discordId } }
    );
  }
}
