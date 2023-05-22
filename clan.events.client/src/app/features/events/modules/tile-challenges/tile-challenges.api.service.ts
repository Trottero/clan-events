import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ChallengeResponse,
  CreateChallengeRequest,
  UpdateChallengeRequest,
} from '@common/events';
import { Response } from '@common/responses';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class TileChallengesApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) {}

  getChallenges(
    clanName: string,
    eventId: string,
    tileId: string
  ): Observable<Response<ChallengeResponse[]>> {
    return this.http.get<Response<ChallengeResponse[]>>(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles/${tileId}/challenges`
    );
  }

  createChallenge(
    clanName: string,
    eventId: string,
    tileId: string,
    request: CreateChallengeRequest
  ) {
    return this.http.post(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles/${tileId}/challenges`,
      request
    );
  }

  updateChallenge(
    clanName: string,
    eventId: string,
    tileId: string,
    challengeId: string,
    request: UpdateChallengeRequest
  ) {
    return this.http.put(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles/${tileId}/challenges/${challengeId}`,
      request
    );
  }

  deleteChallenge(
    clanName: string,
    eventId: string,
    tileId: string,
    challengeId: string
  ) {
    return this.http.delete(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles/${tileId}/challenges/${challengeId}`
    );
  }
}
