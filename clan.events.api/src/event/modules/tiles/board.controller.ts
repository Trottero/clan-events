import { ClanRole } from '@common/auth/clan.role';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import { UserClanContext } from 'src/auth/user-clan-context';
import { User } from 'src/common/decorators/user.decorator';
import { BoardService } from './board.service';
import { CreateTileRequest } from '@common/events';
import { convertToTileResponse } from 'src/event/converters/tile.converter';

@Controller(':clanName/events/:eventId')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('tiles')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getTiles(
    @User() user: UserClanContext,
    @Param() params: { clanName: string; eventId: string },
  ) {
    return (
      await this.boardService.getTiles(params.clanName, params.eventId)
    ).map(convertToTileResponse);
  }

  @Post('tiles')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async createTile(
    @User() user: UserClanContext,
    @Param() params: { clanName: string; eventId: string },
    @Body() body: CreateTileRequest,
  ) {
    return this.boardService.createTile(params.clanName, params.eventId, body);
  }
}
