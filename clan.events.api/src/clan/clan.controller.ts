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
  Patch,
} from '@nestjs/common';
import { ClanService } from './clan.service';
import { Clan } from 'src/database/schemas/clan.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  AddClanMemberRequest,
  ClanMemberResponse,
  ClanResponse,
  CreateClanRequest,
  DeleteClanMemberRequest,
  DeleteClanRequest,
  UpdateClanMemberRequest,
} from 'clan.events.common/clan';
import { ClanMembershipService } from './clan-membership.service';
import { ClanRole } from 'src/database/models/auth.role';
import { JwtTokenContent } from 'clan.events.common/auth';

@Controller('clan')
export class ClanController {
  constructor(
    private readonly clanService: ClanService,
    private readonly clanMembershipService: ClanMembershipService,
  ) {}

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
      const createdClan = await this.clanService.createClan(clan.name);

      await this.clanMembershipService.addMemberToClan(
        createdClan,
        jwt.discordId,
        ClanRole.Owner,
      );

      return this.clanService.getClanByName(clan.name);
    } catch (ex: any) {
      if (ex.code === 11000) {
        throw new BadRequestException('A clan with this name already exists');
      }
      throw ex;
    }
  }

  @UseGuards(AuthGuard)
  @Delete()
  async deleteClan(
    @Request() req,
    @Body() clan: DeleteClanRequest,
  ): Promise<void> {
    const jwt = req.user as JwtTokenContent;
    try {
      await this.clanService.deleteClan(clan.name, jwt.discordId);
    } catch (ex: any) {
      if (ex.message === 'Clan not found') {
        throw new NotFoundException(ex.message);
      }
    }
  }

  @Get('/:clanName')
  @UseGuards(AuthGuard)
  async getClan(@Param('clanName') clanName: string): Promise<ClanResponse> {
    const result = await this.clanService.getClanByName(clanName);
    if (!result) {
      throw new NotFoundException('Clan not found');
    }
    return result;
  }

  @Post('/:clanName/members')
  @UseGuards(AuthGuard)
  async addMemberToClan(
    @Param('clanName') clanName: string,
    @Body() body: AddClanMemberRequest,
  ): Promise<ClanMemberResponse> {
    const clan = await this.clanService.getClanByName(clanName);
    if (!clan) {
      throw new NotFoundException('Clan not found');
    }

    await this.clanMembershipService.addMemberToClan(
      clan,
      body.discordId,
      body.clanRole as ClanRole,
    );

    return {
      clanRole: body.clanRole as ClanRole,
      discordId: body.discordId,
    };
  }

  @Delete('/:clanName/members')
  @UseGuards(AuthGuard)
  async removeMemberToClan(
    @Param('clanName') clanName: string,
    @Body() body: DeleteClanMemberRequest,
  ): Promise<void> {
    const clan = await this.clanService.getClanByName(clanName);
    if (!clan) {
      throw new NotFoundException('Clan not found');
    }

    await this.clanMembershipService.removeMemberFromClan(clan, body.discordId);
  }

  @Patch('/:clanName/members')
  @UseGuards(AuthGuard)
  async updateMemberToClan(
    @Param('clanName') clanName: string,
    @Body() body: UpdateClanMemberRequest,
  ): Promise<ClanMemberResponse> {
    const clan = await this.clanService.getClanByName(clanName);
    if (!clan) {
      throw new NotFoundException('Clan not found');
    }

    await this.clanMembershipService.updateMemberRole(
      clan,
      body.discordId,
      body.clanRole as ClanRole,
    );

    return {
      clanRole: body.clanRole as ClanRole,
      discordId: body.discordId,
    };
  }
}
