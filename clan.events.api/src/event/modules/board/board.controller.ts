import { ClanRole } from '@common/auth/clan.role';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RequiresClanRoles } from 'src/clan/decorators/requires-clan-roles.decorator';

import { BoardService } from './board.service';
import { BoardResponse, CreateTileRequest } from '@common/events';
import { convertToTileResponse } from 'src/event/converters/tile.converter';
import { ClanContext } from 'src/clan/clan-context/clan-context.model';
import { ClanContextParam } from 'src/clan/clan-context/clan-context.param';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { TileDocument } from 'src/database/schemas/tile.schema';

@Controller(':clanName/events/:eventId')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('tiles')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getTiles(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string },
  ): Promise<BoardResponse> {
    const board = await this.boardService.getBoard(
      clanContext.name,
      params.eventId,
    );
    return {
      tiles: (board.tiles as TileDocument[]).map(convertToTileResponse),
      type: board.type,
    };
  }

  @Post('tiles')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async createTile(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string },
    @Body() body: CreateTileRequest,
  ) {
    return this.boardService.createTile(clanContext.name, params.eventId, body);
  }

  @Post('background')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string },
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const background = await this.boardService.updateBackground(
      clanContext.name,
      params.eventId,
      file,
    );

    if (!background) {
      throw new BadRequestException('Could not update background');
    }

    res.set({
      'Content-Type': background.mimeType,
      'Content-Disposition': `inline`,
    });
    return new StreamableFile(background.buffer);
  }

  @Get('background')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getBackground(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const background = await this.boardService.getBackground(
      clanContext.name,
      params.eventId,
    );

    if (!background) {
      throw new NotFoundException('No background found');
    }

    res.set({
      'Content-Type': background.mimeType,
      'Content-Disposition': `inline`,
    });
    return new StreamableFile(background.buffer);
  }
}
