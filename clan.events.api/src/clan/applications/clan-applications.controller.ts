import { ClanRole } from '@common/auth/clan.role';
import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { HasRoleInClan } from 'src/auth/authorized.decorator';
import { ApiTokenGuard } from 'src/auth/guards/api-token.guard';
import { ClanApplication } from 'src/database/schemas/clan-application.schema';
import { ClanContextGuard } from 'src/auth/guards/clan-context.guard';
import { ClanMembership } from 'src/database/schemas/clan-membership.schema';
import { ClanApplicationService } from './clan-application.service';
import { JwtTokenContent } from '@common/auth';
import {
  ApproveClanApplicationRequest,
  DeleteClanApplicationRequest,
} from '@common/clan';
import { User } from 'src/common/decorators/user.decorator';
import { ClanDocument } from 'src/database/schemas/clan.schema';
import { ClanContext } from '../../common/decorators/clan-context.decorator';
import { ClanRequestContext } from '../../common/decorators/clan-context';

@Controller('clan/:clanName/applications')
export class ClanApplicationsController {
  constructor(
    private readonly clanApplicationService: ClanApplicationService,
  ) {}

  @Get()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async getApplications(
    @ClanContext() clanContext: ClanRequestContext,
  ): Promise<ClanApplication[]> {
    return await this.clanApplicationService.getApplicationsForClan(
      clanContext.id,
    );
  }

  @Post()
  @UseGuards(ApiTokenGuard, ClanContextGuard)
  async applyToClan(
    @User() user: JwtTokenContent,
    @ClanContext() clanContext: ClanRequestContext,
  ): Promise<ClanApplication> {
    try {
      return await this.clanApplicationService.applyForClan(
        clanContext,
        user.sub,
        user.discordId,
        user.username,
      );
    } catch (ex: any) {
      console.error(ex);
      if (ex.error === '0') {
        throw new Error('You have already applied to this clan');
      }
    }
  }

  @Post('approve')
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async approveApplication(
    @ClanContext() clanContext: ClanDocument,
    @Body() body: ApproveClanApplicationRequest,
  ): Promise<ClanMembership> {
    return this.clanApplicationService.approveApplication(
      clanContext,
      body.discordId,
    );
  }

  @Delete()
  @HasRoleInClan(ClanRole.Owner, ClanRole.Admin)
  async deleteApplication(
    @ClanContext() clanContext: ClanRequestContext,
    @Body() body: DeleteClanApplicationRequest,
  ): Promise<void> {
    return await this.clanApplicationService.deleteApplication(
      clanContext.id,
      body.discordId,
    );
  }
}
