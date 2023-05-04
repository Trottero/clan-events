import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from 'src/database/schemas/event.schema';
import { EventListItem, GetEventsRequest } from 'clan.events.common/events';
import { PaginatedResponse } from 'clan.events.common/pagination';
import { convertToEventListResponse } from './converters/event-list.converter';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAllEvents(
    @Query() params: GetEventsRequest,
  ): Promise<PaginatedResponse<EventListItem>> {
    const { page, pageSize } = params;

    const result = await this.eventService.getAllEvents(page, pageSize);
    const count = await this.eventService.countAllEvents();

    return convertToEventListResponse(result, {
      page,
      pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
    });
  }

  @Get('random')
  async createRandomEvent(): Promise<Event> {
    return await this.eventService.createRandomEvent();
  }

  @Get(':id')
  async getEventById(@Param() params): Promise<Event> {
    const id = params.id;
    return await this.eventService.getEventById(id);
  }
}
