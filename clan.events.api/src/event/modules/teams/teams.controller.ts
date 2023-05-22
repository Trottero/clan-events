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
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import { GuardEventContext } from 'src/event/event-context-guard';
import { ClanRequestContext } from 'src/common/decorators/clan-context';
import { ClanContext } from 'src/common/decorators/clan-context.decorator';
import {
  EventContext,
  EventRequestContext,
} from 'src/event/event-context-decorator';
import { TeamsService } from './teams.service';
import { EventDocument } from 'src/database/schemas/event.schema';
import { EventTeamResponse, UpdateTeamRequest } from '@common/events';

@Controller(':clanName/events/:eventId/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @GuardEventContext()
  async getTeams(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
  ): Promise<EventTeamResponse[]> {
    return eventContext.participants.map((x) => ({
      id: x.id,
      name: x.name,
      members: x.members,
    }));
  }

  @Post()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  @GuardEventContext()
  async createTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
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
        members: result.members,
      };
    } catch (ex: any) {
      throw new BadRequestException(ex.message);
    }
  }

  @Get(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @GuardEventContext()
  async getTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
    @Param('id') id: string,
  ): Promise<EventTeamResponse> {
    const result = eventContext.participants.find((x) => x.id === id);

    return {
      id: result.id,
      name: result.name,
      members: result.members,
    };
  }

  @Put(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @GuardEventContext()
  async updateTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
    @Body() team: UpdateTeamRequest,
    @Param('id') id: string,
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
      members: result.members,
    };
  }

  @Delete(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @GuardEventContext()
  async deleteTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    return this.teamsService.deleteTeam(eventContext as EventDocument, id);
  }
}
