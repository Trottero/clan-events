import { Injectable } from '@angular/core';
import { PaginatedResponse, Response } from '@common/responses';
import {
  CreateEventRequest,
  EventListItem,
  EventResponse,
  GetEventsRequest,
  UpdateEventRequest,
} from '@common/events';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { ValuesOf, FormControl } from '@ngneat/reactive-forms';

@Injectable()
export class EventsService {
  constructor(
    private readonly http: HttpClient,
    private readonly configService: ConfigService
  ) {}

  getEvents(
    clanName: string,
    request: GetEventsRequest
  ): Observable<PaginatedResponse<EventListItem>> {
    return this.http.get<PaginatedResponse<EventListItem>>(
      `${this.configService.backEndUrl}/${clanName}/events`,
      {
        params: {
          page: request.page.toString(),
          pageSize: request.pageSize.toString(),
        },
      }
    );
  }

  getEventById(
    id: string,
    clanName: string
  ): Observable<Response<EventResponse>> {
    return this.http.get<Response<EventResponse>>(
      `${this.configService.backEndUrl}/${clanName}/events/${id}`
    );
  }

  createEvent(
    clanName: string,
    request: CreateEventRequest
  ): Observable<Response<EventResponse>> {
    return this.http.post<Response<EventResponse>>(
      `${this.configService.backEndUrl}/${clanName}/events`,
      request
    );
  }

  deleteEventById(id: string, clanName: string): Observable<void> {
    return this.http.delete<void>(
      `${this.configService.backEndUrl}/${clanName}/events/${id}`
    );
  }

  updateEvent(
    id: string,
    clanName: string,
    request: UpdateEventRequest
  ): Observable<Response<EventResponse>> {
    return this.http.put<Response<EventResponse>>(
      `${this.configService.backEndUrl}/${clanName}/events/${id}`,
      request
    );
  }
}
