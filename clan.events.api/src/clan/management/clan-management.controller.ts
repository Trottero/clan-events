import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ClanService } from '../clan.service';
import { ClanMembershipService } from './clan-membership.service';
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { ClanRole } from '@common/auth/clan.role';
import { JwtTokenContent } from '@common/auth';
import {
  AddClanMemberRequest,
  ClanMemberResponse,
  ClanResponse,
  DeleteClanMemberRequest,
  UpdateClanMemberRequest,
} from '@common/clan';
import { UserClanContext } from 'src/auth/user-clan-context';

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
      throw ex;
    }
  }

  @Get()
  @HasRoleInClan(ClanRole.Member, ClanRole.Owner, ClanRole.Admin)
  async getClan(@Param('clanName') clanName: string): Promise<ClanResponse> {
    const result = await this.clanService.getClanByName(clanName);
    if (!result) {
      throw new NotFoundException('Clan not found');
    }
    return {
      name: result.name,
      displayName: result.displayName,
      members: result.members.map((x) => {
        return {
          name: x.user.name,
          discordId: x.user.discordId,
          clanRole: x.role,
        };
      }),
    };
  }

  @Delete('members')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async removeMemberToClan(
    @Param('clanName') clanName: string,
    @User() user: UserClanContext,
    @Body() body: DeleteClanMemberRequest,
  ): Promise<void> {
    const clan = await this.clanService.getClanByName(clanName);
    if (!clan) {
      throw new NotFoundException('Clan not found');
    }

    if (user.discordId == body.discordId) {
      throw new UnauthorizedException('Cannot remove yourself');
    }

    const memberToDelete = clan.members.find(
      (x) => x.user.discordId === body.discordId,
    );
    if (!memberToDelete) {
      throw new NotFoundException('Member not found');
    }

    if (!this.isAllowedToAssignRole(user.clanRole, memberToDelete.role)) {
      throw new UnauthorizedException('Not allowed to assign role');
    }

    await this.clanMembershipService.removeMemberFromClan(clan, body.discordId);
  }

  @Patch('members')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async updateMemberToClan(
    @Param('clanName') clanName: string,
    @User() user: UserClanContext,
    @Body() body: UpdateClanMemberRequest,
  ): Promise<ClanMemberResponse> {
    if (!this.isAllowedToAssignRole(user.clanRole, body.clanRole)) {
      throw new UnauthorizedException('Not allowed to assign role');
    }

    if (user.discordId == body.discordId) {
      throw new UnauthorizedException('Cannot update yourself');
    }

    const clan = await this.clanService.getClanByName(clanName);
    if (!clan) {
      throw new NotFoundException('Clan not found');
    }

    const membership = await this.clanMembershipService.updateMemberRole(
      clan,
      body.discordId,
      body.clanRole as ClanRole,
    );

    return {
      name: membership.user.name,
      discordId: membership.user.discordId,
      clanRole: membership.role,
    };
  }

  private isAllowedToAssignRole(
    selfRole: ClanRole,
    assignedRole: ClanRole,
  ): boolean {
    if (selfRole === ClanRole.Owner) {
      return assignedRole !== ClanRole.Owner;
    }
    return selfRole === ClanRole.Admin && assignedRole === ClanRole.Member;
  }
}
