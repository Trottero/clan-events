import { ClanRole } from '@common/auth/clan.role';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RequiresClanRoles } from 'src/clan/decorators/requires-clan-roles.decorator';
import { ClanContext } from 'src/clan/clan-context/clan-context.model';
import { ClanContextParam } from 'src/clan/clan-context/clan-context.param';
import { EventContextParam } from 'src/event/event-context/event-context.param';
import { EventContext } from 'src/event/event-context/event-context.model';
import { TeamsService } from './teams.service';
import { EventDocument } from 'src/database/schemas/event.schema';
import { EventTeamResponse, UpdateTeamRequest } from '@common/events';
import { WithEventContext } from 'src/event/event-context/with-event-context.decorator';

@Controller(':clanName/events/:eventId/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @WithEventContext()
  async getTeams(
    @ClanContextParam() clanContext: ClanContext,
    @EventContextParam() eventContext: EventContext,
  ): Promise<EventTeamResponse[]> {
    return eventContext.participants.map((x) => ({
      id: x.id,
      name: x.name,
      members: x.members.map((z) => ({
        id: z.id,
        name: z.name,
        discordId: z.discordId,
      })),
    }));
  }

  @Post()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  @WithEventContext()
  async createTeam(
    @ClanContextParam() clanContext: ClanContext,
    @EventContextParam() eventContext: EventContext,
    @Body() team: UpdateTeamRequest,
  ): Promise<EventTeamResponse> {
    try {
      const result = await this.teamsService.createTeam(
        eventContext as EventDocument,
        {
          id: null,
          name: team.name,
          members: [],
        },
      );

      return {
        id: result.id,
        name: result.name,
        members: result.members.map((x) => ({
          id: x.id,
          name: x.name,
          discordId: x.discordId,
        })),
      };
    } catch (ex: any) {
      throw new BadRequestException(ex.message);
    }
  }

  @Get(':teamId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @WithEventContext()
  async getTeam(
    @ClanContextParam() clanContext: ClanContext,
    @EventContextParam() eventContext: EventContext,
    @Param('teamId') id: string,
  ): Promise<EventTeamResponse> {
    const result = eventContext.participants.find((x) => x.id === id);

    return {
      id: result.id,
      name: result.name,
      members: result.members.map((x) => ({
        id: x.id,
        name: x.name,
        discordId: x.discordId,
      })),
    };
  }

  @Put(':teamId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @WithEventContext()
  async updateTeam(
    @ClanContextParam() clanContext: ClanContext,
    @EventContextParam() eventContext: EventContext,
    @Body() team: UpdateTeamRequest,
    @Param('teamId') id: string,
  ): Promise<EventTeamResponse> {
    const result = await this.teamsService.updateTeam(
      eventContext as EventDocument,
      id,
      team.name,
      team.members,
    );

    return {
      id: result.id,
      name: result.name,
      members: result.members.map((x) => ({
        id: x.id,
        name: x.name,
        discordId: x.discordId,
      })),
    };
  }

  @Delete(':teamId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @WithEventContext()
  async deleteTeam(
    @ClanContextParam() clanContext: ClanContext,
    @EventContextParam() eventContext: EventContext,
    @Param('teamId') id: string,
  ): Promise<void> {
    return this.teamsService.deleteTeam(eventContext as EventDocument, id);
  }
}
