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
import { ApiTokenGuard } from 'src/auth/guards/api-token.guard';
import { ClanMembershipService } from './management/clan-membership.service';
import { JwtTokenContent } from '@common/auth';
import { ClanResponse, ClanWithRole, CreateClanRequest } from '@common/clan';
import { ClanRole } from '@common/auth/clan.role';
import { MongoErrorCode } from 'src/database/mongo-error-codes';
import { User } from 'src/common/decorators/user.decorator';

@Controller('clan')
export class ClanController {
  constructor(
    private readonly clanService: ClanService,
    private readonly clanMembershipService: ClanMembershipService,
  ) {}

  @UseGuards(ApiTokenGuard)
  @Get()
  async getAllClans(@User() user: JwtTokenContent): Promise<ClanWithRole[]> {
    return await this.clanService.getClansForUser(user.sub);
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

      const result = await this.clanService.getClanByName(clan.name);
      return {
        name: result.name,
        displayName: result.displayName,
        members: result.members.map((x) => ({
          clanRole: x.role,
          discordId: x.user.discordId,
          name: x.user.name,
        })),
      };
    } catch (ex: any) {
      if (ex.code === MongoErrorCode.DuplicateKey) {
        throw new BadRequestException('A clan with this name already exists');
      }
      throw ex;
    }
  }
}
