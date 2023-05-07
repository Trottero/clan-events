import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  CreateEventRequest,
  EventListItem,
  EventResponse,
  GetEventByIdRequest,
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
  async getEventsForUser(
    @Query() params: GetEventsRequest,
    @User() user: JwtTokenContent,
  ): Promise<PaginatedModel<EventListItem>> {
    const { page, pageSize } = params;

    const result = await this.eventService.getPaginatedEventsForUser(
      user,
      page,
      pageSize,
    );
    const count = await this.eventService.countEventsForUser(user);

    return convertToEventListResponse(result, {
      page,
      pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getEventById(
    @User() user: JwtTokenContent,
    @Param() { id }: GetEventByIdRequest,
  ): Promise<EventResponse> {
    const event = await this.eventService.getEventById(user, id);
    if (!event) throw new HttpException('Event not found', 404);
    return convertToEventResponse(event);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async createEventForUser(
    @User() user: JwtTokenContent,
    @Body() body: CreateEventRequest,
  ): Promise<any> {
    const event = await this.eventService.createEvent(user, body);
    return convertToEventResponse(event);
  }
}
