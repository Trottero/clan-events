import { Injectable } from '@angular/core';
import { Response } from '@common/responses';
import { CreateTileRequest } from '@common/events';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { TileResponse } from '@common/events';

@Injectable({
  providedIn: 'root',
})
export class BoardApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) {}

  getTiles(
    clanName: string,
    eventId: string
  ): Observable<Response<TileResponse[]>> {
    return this.http.get<Response<TileResponse[]>>(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles`
    );
  }

  createTile(
    clanName: string,
    eventId: string,
    request: CreateTileRequest
  ): Observable<Response<TileResponse>> {
    return this.http.post<Response<TileResponse>>(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles`,
      request
    );
  }

  updateTile(
    clanName: string,
    eventId: string,
    tileId: string,
    request: Partial<CreateTileRequest>
  ): Observable<Response<TileResponse>> {
    return this.http.patch<Response<TileResponse>>(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles/${tileId}`,
      request
    );
  }
}