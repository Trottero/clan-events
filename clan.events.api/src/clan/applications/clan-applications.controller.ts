import { ClanRole } from '@common/auth/clan.role';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RequiresClanRoles } from 'src/clan/decorators/requires-clan-roles.decorator';
import { EnsureApiTokenGuard } from 'src/auth/guards/ensure-api-token.guard';
import { ClanApplication } from 'src/database/schemas/clan-application.schema';
import { ClanContextGuard } from 'src/clan/clan-context/clan-context.guard';
import { ClanApplicationService } from './clan-application.service';
import {
  ApproveClanApplicationRequest,
  ClanMemberResponse,
  DeleteClanApplicationRequest,
} from '@common/clan';
import { UserClanRoleParam } from 'src/clan/clan-role/user-clan-role.param';
import { ClanContextParam } from '../clan-context/clan-context.param';
import { ClanContext } from '../clan-context/clan-context.model';
import { UserClanRole } from '../clan-role/user-clan-role.model';

@Controller('clan/:clanName/applications')
export class ClanApplicationsController {
  constructor(
    private readonly clanApplicationService: ClanApplicationService,
  ) {}

  @Get()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async getApplications(
    @ClanContextParam() clanContext: ClanContext,
  ): Promise<ClanApplication[]> {
    return await this.clanApplicationService.getApplicationsForClan(
      clanContext.id,
    );
  }

  @Post()
  @UseGuards(EnsureApiTokenGuard, ClanContextGuard)
  async applyToClan(
    @UserClanRoleParam() user: UserClanRole,
    @ClanContextParam() clanContext: ClanContext,
  ): Promise<ClanApplication> {
    try {
      return await this.clanApplicationService.applyForClan(
        clanContext,
        user.sub,
        user.discordId,
        user.username,
      );
    } catch (ex: any) {
      throw new BadRequestException(ex.message);
    }
  }

  @Post('approve')
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async approveApplication(
    @ClanContextParam() clanContext: ClanContext,
    @Body() body: ApproveClanApplicationRequest,
  ): Promise<ClanMemberResponse> {
    const result = await this.clanApplicationService.approveApplication(
      clanContext,
      body.discordId,
    );

    return {
      clanRole: result.role,
      discordId: result.user.discordId,
      name: result.user.name,
    };
  }

  @Delete()
  @RequiresClanRoles(ClanRole.Owner, ClanRole.Admin)
  async deleteApplication(
    @ClanContextParam() clanContext: ClanContext,
    @Body() body: DeleteClanApplicationRequest,
  ): Promise<void> {
    return await this.clanApplicationService.deleteApplication(
      clanContext.id,
      body.discordId,
    );
  }
}
