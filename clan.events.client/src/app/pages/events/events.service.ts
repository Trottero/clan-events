import { Injectable } from '@angular/core';
import { PaginatedResponse, Response } from '@common/responses';
import {
  CreateEventRequest,
  EventListItem,
  EventResponse,
  GetEventsRequest,
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

  getEventById(id: string): Observable<Response<EventResponse>> {
    return this.http.get<Response<EventResponse>>(
      `${this.configService.backEndUrl}/events/${id}`
    );
  }

  createEvent(
    request: CreateEventRequest
  ): Observable<Response<EventResponse>> {
    return this.http.post<Response<EventResponse>>(
      `${this.configService.backEndUrl}/events`,
      request
    );
  }
}
