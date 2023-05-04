import { Injectable } from '@angular/core';
import { PaginatedResponse, Response } from 'clan.events.common/responses';
import { EventListItem, EventResponse } from 'clan.events.common/events';
import { GetEventsRequest } from 'clan.events.common/events';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) {}

  public getEvents(
    request: GetEventsRequest
  ): Observable<PaginatedResponse<EventListItem>> {
    return this.http.get<PaginatedResponse<EventListItem>>(
      `${this.configService.backEndUrl}/events`,
      {
        params: {
          page: request.page.toString(),
          pageSize: request.pageSize.toString(),
        },
      }
    );
  }

  public getEventById(id: string) {
    return this.http.get<Response<EventResponse>>(
      `${this.configService.backEndUrl}/events/${id}`
    );
  }
}
