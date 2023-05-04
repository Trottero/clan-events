import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  Body,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { ClanService } from './clan.service';
import { Clan } from 'src/database/schemas/clan.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtTokenContent } from 'src/auth/models/jwt.token';
import {
  ClanResponse,
  CreateClanRequest,
  DeleteClanRequest,
} from 'clan.events.common/clan';

@Controller('clan')
export class ClanController {
  constructor(private readonly clanService: ClanService) {}

  @Get()
  async getAllClans(): Promise<Clan[]> {
    return await this.clanService.getAllClans();
  }

  @Get('random')
  async createRandomClan(): Promise<Clan> {
    const res = await this.clanService.createRandomClan();
    return res;
  }

  @UseGuards(AuthGuard)
  @Post()
  async createClan(
    @Request() req,
    @Body() clan: CreateClanRequest,
  ): Promise<ClanResponse> {
    if (!clan.name) {
      throw new BadRequestException('Name is required');
    }

    const jwt = req.user as JwtTokenContent;
    try {
      return await this.clanService.createClan(clan.name, jwt.sub);
    } catch (ex: any) {
      if (ex.code === 11000) {
        throw new BadRequestException('A clan with this name already exists');
      }
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteClan(
    @Request() req,
    @Body() clan: DeleteClanRequest,
  ): Promise<void> {
    const jwt = req.user as JwtTokenContent;
    await this.clanService.deleteClan(clan.name, jwt.sub);
  }

  @Get('/:clanName')
  async getClan(@Param('clanName') clanName: string): Promise<ClanResponse> {
    const result = await this.clanService.getClanByName(clanName);
    if (!result) {
      throw new NotFoundException('Clan not found');
    }
    return result;
  }
}
