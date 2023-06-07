import { Injectable } from '@angular/core';
import { Response } from '@common/responses';
import { BoardResponse, CreateTileRequest } from '@common/events';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/core/config/config.service';
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
  ): Observable<Response<BoardResponse>> {
    return this.http.get<Response<BoardResponse>>(
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
    request: CreateTileRequest
  ): Observable<Response<TileResponse>> {
    return this.http.put<Response<TileResponse>>(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/tiles/${tileId}`,
      request
    );
  }

  patchTile(
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

  deleteTile(clan: string, eventId: string, id: string): any {
    return this.http.delete(
      `${this.configService.backEndUrl}/${clan}/events/${eventId}/tiles/${id}`
    );
  }

  updateBackground(clan: string, eventId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(
      `${this.configService.backEndUrl}/${clan}/events/${eventId}/background`,
      formData,
      { responseType: 'blob' }
    );
  }

  getBackground(clanName: string, eventId: string) {
    return this.http.get(
      `${this.configService.backEndUrl}/${clanName}/events/${eventId}/background`,
      { responseType: 'blob' }
    );
  }
}
