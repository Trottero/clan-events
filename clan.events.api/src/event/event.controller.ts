import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from 'src/database/schemas/event.schema';
import {
  CreateEventRequest,
  EventListItem,
  EventResponse,
  GetEventsRequest,
} from 'clan.events.common/dist';
import { PaginatedModel } from 'clan.events.common/dist';
import { convertToEventListResponse } from './converters/event-list.converter';
import { convertToEventResponse } from './converters/event.converter';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import { JwtTokenContent } from 'src/auth/models/jwt.token';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAllEvents(
    @Query() params: GetEventsRequest,
  ): Promise<PaginatedModel<EventListItem>> {
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
  async getEventById(@Param() { id }: { id: string }): Promise<EventResponse> {
    const event = await this.eventService.getEventById(id);
    return convertToEventResponse(event);
  }
}
