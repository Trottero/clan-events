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
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import {
  ChallengeResponse,
  CreateChallengeRequest,
  CreateTileRequest,
  UpdateChallengeRequest,
} from '@common/events';
import { ClanRequestContext } from 'src/common/decorators/clan-context';
import { ClanContext } from 'src/common/decorators/clan-context.decorator';
import { TileService } from './tile.service';

@Controller(':clanName/events/:eventId/tiles/:tileId')
export class TileController {
  constructor(private tileService: TileService) {}

  @Put()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async updateTile(
    @ClanContext() clanContext: ClanRequestContext,
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
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async patchTile(
    @ClanContext() clanContext: ClanRequestContext,
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
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async deleteTile(
    @ClanContext() clanContext: ClanRequestContext,
    @Param() params: { eventId: string; tileId: string },
  ) {
    return this.tileService.deleteTile(
      clanContext.name,
      params.eventId,
      params.tileId,
    );
  }

  @Get('challenges')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getChallenges(
    @ClanContext() clanContext: ClanRequestContext,
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
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async createChallenge(
    @ClanContext() clanContext: ClanRequestContext,
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
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async updateChallenge(
    @ClanContext() clanContext: ClanRequestContext,
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
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async deleteChallenge(
    @ClanContext() clanContext: ClanRequestContext,
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
