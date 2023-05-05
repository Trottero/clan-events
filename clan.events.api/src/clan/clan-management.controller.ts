import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClanService } from './clan.service';
import { ClanMembershipService } from './clan-membership.service';
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ClanRole } from '@common/auth/auth.role';
import { JwtTokenContent } from '@common/auth';
import {
  AddClanMemberRequest,
  ClanMemberResponse,
  ClanResponse,
  DeleteClanMemberRequest,
  UpdateClanMemberRequest,
} from '@common/clan';

@Controller('clan/:clanName')
export class ClanManagementController {
  constructor(
    private readonly clanService: ClanService,
    private readonly clanMembershipService: ClanMembershipService,
  ) {}

  @Delete()
  @HasRoleInClan(ClanRole.Owner)
  async deleteClan(
    @User() user: JwtTokenContent,
    @Param('clanName') clanName: string,
  ): Promise<void> {
    try {
      await this.clanService.deleteClan(clanName, user.discordId);
    } catch (ex: any) {
      if (ex.message === 'Clan not found') {
        throw new NotFoundException(ex.message);
      }
    }
  }

  @Get()
  @HasRoleInClan(ClanRole.Member, ClanRole.Owner, ClanRole.Admin)
  async getClan(@Param('clanName') clanName: string): Promise<ClanResponse> {
    const result = await this.clanService.getClanByName(clanName);
    if (!result) {
      throw new NotFoundException('Clan not found');
    }
    return result;
  }

  @Post('members')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
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

  @Delete('members')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
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

  @Patch('members')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
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
