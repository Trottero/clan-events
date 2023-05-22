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
import { HasRoleInClan } from 'src/auth/authorized.decorator';

import { BoardService } from './board.service';
import { CreateTileRequest } from '@common/events';
import { convertToTileResponse } from 'src/event/converters/tile.converter';
import { ClanRequestContext } from 'src/common/decorators/clan-context';
import { ClanContext } from 'src/common/decorators/clan-context.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

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

  @Post('background')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @ClanContext() clanContext: ClanRequestContext,
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
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin, ClanRole.Member)
  async getBackground(
    @ClanContext() clanContext: ClanRequestContext,
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
