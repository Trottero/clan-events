import { ClanRole } from '@common/auth/clan.role';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ChallengeResponse,
  CreateChallengeRequest,
  CreateTileRequest,
  UpdateChallengeRequest,
} from '@common/events';
import { ClanContextParam } from 'src/clan/clan-context/clan-context.param';
import { TileService } from './tile.service';
import { RequiresClanRoles } from 'src/clan/decorators/requires-clan-roles.decorator';
import { ClanContext } from 'src/clan/clan-context/clan-context.model';

@Controller(':clanName/events/:eventId/tiles/:tileId')
export class TileController {
  constructor(private tileService: TileService) {}

  @Put()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async updateTile(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string },
    @Body() body: CreateTileRequest,
  ) {
    return this.tileService.updateTile(
      clanContext.name,
      params.eventId,
      params.tileId,
      body,
    );
  }

  @Patch()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async patchTile(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string },
    @Body() body: Partial<CreateTileRequest>,
  ) {
    return this.tileService.patchTile(
      clanContext.name,
      params.eventId,
      params.tileId,
      body,
    );
  }

  @Delete()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async deleteTile(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string },
  ) {
    return this.tileService.deleteTile(
      clanContext.name,
      params.eventId,
      params.tileId,
    );
  }

  @Get('challenges')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getChallenges(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string },
  ): Promise<ChallengeResponse[]> {
    const documents = await this.tileService.getChallenges(
      clanContext.name,
      params.eventId,
      params.tileId,
    );

    return documents.map((document) => ({
      id: document.id,
      description: document.description,
      nextTile: document.nextTile?.toString(),
    }));
  }

  @Post('challenges')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async createChallenge(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string },
    @Body() body: CreateChallengeRequest,
  ) {
    return this.tileService.createChallenge(
      clanContext.name,
      params.eventId,
      params.tileId,
      body,
    );
  }

  @Put('challenges/:challengeId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async updateChallenge(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string; challengeId: string },
    @Body() body: UpdateChallengeRequest,
  ) {
    return this.tileService.updateChallenge(
      clanContext.name,
      params.eventId,
      params.tileId,
      params.challengeId,
      body,
    );
  }

  @Delete('challenges/:challengeId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async deleteChallenge(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string; challengeId: string },
  ) {
    return this.tileService.deleteChallenge(
      clanContext.name,
      params.eventId,
      params.tileId,
      params.challengeId,
    );
  }
}
