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
  UseGuards,
} from '@nestjs/common';
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import { EventContextGuard } from 'src/event/event-context-guard';
import { ClanRequestContext } from 'src/common/decorators/clan-context';
import { ClanContext } from 'src/common/decorators/clan-context.decorator';
import {
  EventContext,
  EventRequestContext,
} from 'src/event/event-context-decorator';
import { EventTeam } from 'src/database/schemas/event-team.schema';
import { TeamsService } from './teams.service';
import { EventDocument } from 'src/database/schemas/event.schema';
import { UpdateTeamRequest } from '@common/events';

@Controller(':clanName/events/:eventId/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @UseGuards(EventContextGuard)
  async getTeams(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
  ): Promise<EventTeam[]> {
    return eventContext.participants;
  }

  @Post()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  @UseGuards(EventContextGuard)
  async createTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
    @Body() team: UpdateTeamRequest,
  ): Promise<EventTeam> {
    try {
      return await this.teamsService.createTeam(eventContext as EventDocument, {
        name: team.name,
        members: [],
      });
    } catch (ex: any) {
      throw new BadRequestException(ex.message);
    }
  }

  @Get(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @UseGuards(EventContextGuard)
  async getTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
    @Param('id') id: string,
  ): Promise<EventTeam> {
    return eventContext.participants.find(
      (x) => (x as any).id.toString() === id,
    );
  }

  @Put(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @UseGuards(EventContextGuard)
  async updateTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
    @Body() team: UpdateTeamRequest,
    @Param('id') id: string,
  ): Promise<EventTeam> {
    return this.teamsService.updateTeam(
      eventContext as EventDocument,
      id,
      team.name,
      team.members,
    );
  }

  @Delete(':id')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  @UseGuards(EventContextGuard)
  async deleteTeam(
    @ClanContext() clanContext: ClanRequestContext,
    @EventContext() eventContext: EventRequestContext,
    @Param('id') id: string,
  ): Promise<void> {
    return this.teamsService.deleteTeam(eventContext as EventDocument, id);
  }
}
