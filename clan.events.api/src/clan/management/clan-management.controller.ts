import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { ClanService } from '../clan.service';
import { ClanMembershipService } from './clan-membership.service';
import { RequiresClanRoles } from 'src/clan/decorators/requires-clan-roles.decorator';
import { UserClanRoleParam } from 'src/clan/clan-role/user-clan-role.param';
import { ClanRole } from '@common/auth/clan.role';
import {
  ClanMemberResponse,
  ClanResponse,
  DeleteClanMemberRequest,
  UpdateClanMemberRequest,
} from '@common/clan';
import { ClanContextParam } from '../clan-context/clan-context.param';
import { ClanContext } from '../clan-context/clan-context.model';
import { UserClanRole } from '../clan-role/user-clan-role.model';

@Controller('clan/:clanName')
export class ClanManagementController {
  constructor(
    private readonly clanService: ClanService,
    private readonly clanMembershipService: ClanMembershipService,
  ) {}

  @Delete()
  @RequiresClanRoles(ClanRole.Owner)
  async deleteClan(@ClanContextParam() clan: ClanContext): Promise<void> {
    try {
      await this.clanService.deleteClan(clan.name);
    } catch (ex: any) {
      if (ex.message === 'Clan not found') {
        throw new NotFoundException(ex.message);
      }
      throw ex;
    }
  }

  @Get()
  @RequiresClanRoles(ClanRole.Member, ClanRole.Owner, ClanRole.Admin)
  async getClan(@ClanContextParam() clan: ClanContext): Promise<ClanResponse> {
    return {
      name: clan.name,
      displayName: clan.displayName,
      members: clan.members.map((x) => {
        return {
          id: x.user.id,
          name: x.user.name,
          discordId: x.user.discordId,
          clanRole: x.role,
        };
      }),
    };
  }

  @Delete('members')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async removeMemberToClan(
    @ClanContextParam() clan: ClanContext,
    @UserClanRoleParam() user: UserClanRole,
    @Body() body: DeleteClanMemberRequest,
  ): Promise<void> {
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
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async updateMemberToClan(
    @ClanContextParam() clan: ClanContext,
    @UserClanRoleParam() user: UserClanRole,
    @Body() body: UpdateClanMemberRequest,
  ): Promise<ClanMemberResponse> {
    if (!this.isAllowedToAssignRole(user.clanRole, body.clanRole)) {
      throw new UnauthorizedException('Not allowed to assign role');
    }

    if (user.discordId == body.discordId) {
      throw new UnauthorizedException('Cannot update yourself');
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
