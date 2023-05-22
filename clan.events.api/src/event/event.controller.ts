import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import {
  CreateEventRequest,
  DeleteEventByIdRequest,
  EventListItem,
  EventResponse,
  GetEventByIdRequest,
  GetEventsRequest,
  UpdateEventParams,
  UpdateEventRequest,
} from '@common/events';
import { PaginatedModel } from '@common/responses';
import { convertToEventListResponse } from './converters/event-list.converter';
import { convertToEventResponse } from './converters/event.converter';
import { User } from 'src/common/decorators/user.decorator';
import { ApiTokenGuard } from 'src/auth/guards/api-token.guard';
import { UserClanContext } from 'src/auth/user-clan-context';
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import { EventContextGuard, GuardEventContext } from './event-context-guard';
import { ClanRole } from '@common/auth/clan.role';

@Controller(':clanName/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @HasRoleInClan()
  async getEventsForUser(
    @Query() params: GetEventsRequest,
    @User() user: UserClanContext,
    @Param('clanName') clanName: string,
  ): Promise<PaginatedModel<EventListItem>> {
    const { page, pageSize } = params;

    const result = await this.eventService.getPaginatedEventsForUserInClan(
      clanName,
      user,
      page,
      pageSize,
    );

    const count = await this.eventService.countEventsForUserInClan(
      clanName,
      user,
    );

    return convertToEventListResponse(result, {
      page,
      pageSize,
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
    });
  }

  @Get(':id')
  @GuardEventContext()
  async getEventById(
    @User() user: UserClanContext,
    @Param() { clanName, id }: GetEventByIdRequest,
  ): Promise<EventResponse> {
    const event = await this.eventService.getEventById(user, clanName, id);
    if (!event) throw new HttpException('Event not found', 404);
    return convertToEventResponse(event);
  }

  @Post()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  public async createEventForUser(
    @User() user: UserClanContext,
    @Body() body: CreateEventRequest,
    @Param('clanName') clanName: string,
  ): Promise<any> {
    const event = await this.eventService.createEvent(user, clanName, body);
    return convertToEventResponse(event);
  }

  @Delete(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  public async deleteEventById(
    @User() user: UserClanContext,
    @Param() { id }: DeleteEventByIdRequest,
  ): Promise<any> {
    await this.eventService.deleteEventById(user, id);
  }

  @Put(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  public async updateEventById(
    @Body() body: UpdateEventRequest,
    @Param() { id }: UpdateEventParams,
  ): Promise<any> {
    const event = await this.eventService.updateEvent(id, body);
    return convertToEventResponse(event);
  }
}
