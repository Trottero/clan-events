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
} from '@common/events';
import { PaginatedModel } from '@common/responses';
import { convertToEventListResponse } from './converters/event-list.converter';
import { convertToEventResponse } from './converters/event.converter';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtTokenContent } from 'src/auth/models/jwt.token';
import { User } from 'src/common/decorators/user.decorator';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllEvents(
    @Query() params: GetEventsRequest,
    @User() user: JwtTokenContent,
  ): Promise<PaginatedModel<EventListItem>> {
    const { page, pageSize } = params;

    const result = await this.eventService.getAllEventsForUser(
      user,
      page,
      pageSize,
    );
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

  @Post()
  @UseGuards(AuthGuard)
  public async createEvent(
    @User() user: JwtTokenContent,
    @Body() body: CreateEventRequest,
  ): Promise<any> {
    const event = await this.eventService.createEvent(user, body);
    return convertToEventResponse(event);
  }
}
