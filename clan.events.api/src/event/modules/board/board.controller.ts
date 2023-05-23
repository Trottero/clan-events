import { ClanRole } from '@common/auth/clan.role';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RequiresClanRoles } from 'src/clan/decorators/requires-clan-roles.decorator';

import { BoardService } from './board.service';
import { CreateTileRequest } from '@common/events';
import { convertToTileResponse } from 'src/event/converters/tile.converter';
import { ClanContext } from 'src/clan/clan-context/clan-context.model';
import { ClanContextParam } from 'src/clan/clan-context/clan-context.param';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@Controller(':clanName/events/:eventId')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('tiles')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getTiles(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string },
  ) {
    return (
      await this.boardService.getTiles(clanContext.name, params.eventId)
    ).map(convertToTileResponse);
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

  @Put('tiles/:tileId')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async updateTile(
    @ClanContextParam() clanContext: ClanContext,
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
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async patchTile(
    @ClanContextParam() clanContext: ClanContext,
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
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async deleteTile(
    @ClanContextParam() clanContext: ClanContext,
    @Param() params: { eventId: string; tileId: string },
  ) {
    return this.boardService.deleteTile(
      clanContext.name,
      params.eventId,
      params.tileId,
    );
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
