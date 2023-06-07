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
import { UserClanRoleParam } from 'src/clan/clan-role/user-clan-role.param';
import { RequiresClanRoles } from 'src/clan/decorators/requires-clan-roles.decorator';
import { ClanRole } from '@common/auth/clan.role';
import { UserClanRole } from 'src/clan/clan-role/user-clan-role.model';
import { WithEventContext } from './event-context/with-event-context.decorator';

@Controller(':clanName/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @RequiresClanRoles()
  async getEventsForUser(
    @Query() params: GetEventsRequest,
    @UserClanRoleParam() user: UserClanRole,
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

  @Get(':eventId')
  @WithEventContext()
  async getEventById(
    @UserClanRoleParam() user: UserClanRole,
    @Param() { clanName, eventId }: GetEventByIdRequest,
  ): Promise<EventResponse> {
    const event = await this.eventService.getEventById(user, clanName, eventId);
    if (!event) throw new HttpException('Event not found', 404);
    return convertToEventResponse(event);
  }

  @Post()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  public async createEventForUser(
    @UserClanRoleParam() user: UserClanRole,
    @Body() body: CreateEventRequest,
    @Param('clanName') clanName: string,
  ): Promise<EventResponse> {
    const event = await this.eventService.createEvent(user, clanName, body);
    return convertToEventResponse(event);
  }

  @Delete(':eventId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  public async deleteEventById(
    @Param() { eventId }: DeleteEventByIdRequest,
  ): Promise<any> {
    await this.eventService.deleteEventById(eventId);
  }

  @Put(':eventId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  public async updateEventById(
    @Body() body: UpdateEventRequest,
    @Param() { eventId }: UpdateEventParams,
  ): Promise<EventResponse> {
    const event = await this.eventService.updateEvent(eventId, body);
    return convertToEventResponse(event);
  }
}
