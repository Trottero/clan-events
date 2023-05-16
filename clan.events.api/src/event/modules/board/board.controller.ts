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
import { UserClanContext } from 'src/auth/user-clan-context';
import { User } from 'src/common/decorators/user.decorator';
import { BoardService } from './board.service';
import { CreateTileRequest } from '@common/events';
import { convertToTileResponse } from 'src/event/converters/tile.converter';
import { ClanRequestContext } from 'src/common/decorators/clan-context';
import { ClanContext } from 'src/common/decorators/clan-context.decorator';

@Controller(':clanName/events/:eventId')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('tiles')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getTiles(
    @ClanContext() clanContext: ClanRequestContext,
    @Param() params: { eventId: string },
  ) {
    return (
      await this.boardService.getTiles(clanContext.name, params.eventId)
    ).map(convertToTileResponse);
  }

  @Post('tiles')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async createTile(
    @ClanContext() clanContext: ClanRequestContext,
    @Param() params: { eventId: string },
    @Body() body: CreateTileRequest,
  ) {
    return this.boardService.createTile(clanContext.name, params.eventId, body);
  }

  @Put('tiles/:tileId')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async updateTile(
    @ClanContext() clanContext: ClanRequestContext,
    @Param() params: { eventId: string; tileId: string },
    @Body() body: CreateTileRequest,
  ) {
    return this.boardService.updateTile(
      clanContext.name,
      params.eventId,
      params.tileId,
      body,
    );
  }

  @Patch('tiles/:tileId')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async patchTile(
    @ClanContext() clanContext: ClanRequestContext,
    @Param() params: { eventId: string; tileId: string },
    @Body() body: Partial<CreateTileRequest>,
  ) {
    return this.boardService.patchTile(
      clanContext.name,
      params.eventId,
      params.tileId,
      body,
    );
  }

  @Delete('tiles/:tileId')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async deleteTile(
    @ClanContext() clanContext: ClanRequestContext,
    @Param() params: { eventId: string; tileId: string },
  ) {
    return this.boardService.deleteTile(
      clanContext.name,
      params.eventId,
      params.tileId,
    );
  }
}
