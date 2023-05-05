import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { ClanService } from './clan.service';
import { Clan } from 'src/database/schemas/clan.schema';
import { ApiTokenGuard } from 'src/auth/guards/api-token.guard';
import { ClanMembershipService } from './clan-membership.service';
import { JwtTokenContent } from '@common/auth';
import { ClanResponse, CreateClanRequest } from '@common/clan';
import { ClanRole } from '@common/auth/clan.role';
import { MongoErrorCode } from 'src/database/mongo-error-codes';

@Controller('clan')
export class ClanController {
  constructor(
    private readonly clanService: ClanService,
    private readonly clanMembershipService: ClanMembershipService,
  ) {}

  @UseGuards(ApiTokenGuard)
  @Get()
  async getAllClans(): Promise<Clan[]> {
    return await this.clanService.getAllClans();
  }

  @UseGuards(ApiTokenGuard)
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
      const createdClan = await this.clanService.createClan(clan.name);

      await this.clanMembershipService.addMemberToClan(
        createdClan,
        jwt.discordId,
        ClanRole.Owner,
      );

      return this.clanService.getClanByName(clan.name);
    } catch (ex: any) {
      if (ex.code === MongoErrorCode.DuplicateKey) {
        throw new BadRequestException('A clan with this name already exists');
      }
      throw ex;
    }
  }
}
