import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ClanApplication,
  ClanApplicationDocument,
} from 'src/database/schemas/clan-application.schema';
import { ClanContext } from '../clan-context/clan-context.model';
import { ClanMembershipService } from '../management/clan-membership.service';
import { ClanRole } from '@common/auth/clan.role';
import { ClanMembership } from 'src/database/schemas/clan-membership.schema';
import { ClanDocument } from 'src/database/schemas/clan.schema';

@Injectable()
export class ClanApplicationService {
  constructor(
    @InjectModel(ClanApplication.name)
    private clanApplicationModel: Model<ClanApplication>,
    private readonly clanMembershipService: ClanMembershipService,
  ) {}

  async getApplicationsForClan(
    clanId: string,
  ): Promise<ClanApplicationDocument[]> {
    return await this.clanApplicationModel.find({ clan: clanId }).exec();
  }

  async applyForClan(
    clan: ClanContext,
    userId: string,
    discordId: number,
    discordName: string,
  ): Promise<ClanApplicationDocument> {
    this.checkIfNotAlreadyInClan(clan, discordId);

    const hasApplication = await this.userHasActiveApplication(clan, discordId);

    if (hasApplication) {
      throw new Error('This user has already applied to this clan');
    }

    const application = new this.clanApplicationModel({
      clan: clan.id,
      user: userId,
      discordId: discordId,
      discordName: discordName,
      createdAt: new Date(),
    });

    return await application.save();
  }

  async deleteApplication(clanId: string, discordId: number): Promise<void> {
    await this.clanApplicationModel
      .findOneAndDelete({
        clan: clanId,
        discordId: discordId,
      })
      .exec();
  }

  async approveApplication(
    clan: ClanDocument,
    discordId: number,
  ): Promise<ClanMembership> {
    // Check if user has an open application
    const hasApplication = await this.userHasActiveApplication(
      clan as unknown as ClanContext,
      discordId,
    );

    if (!hasApplication) {
      throw new Error('This user does not have an open application');
    }

    await this.deleteApplication(clan.id, discordId);

    this.checkIfNotAlreadyInClan(clan as unknown as ClanContext, discordId);

    return await this.clanMembershipService.addMemberToClan(
      clan,
      discordId,
      ClanRole.Member,
    );
  }

  private async userHasActiveApplication(clan: ClanContext, discordId: number) {
    const existing = await this.getApplicationsForClan(clan.id);
    const hasApplication = existing.some((x) => x.discordId === discordId);
    return hasApplication;
  }

  private checkIfNotAlreadyInClan(clan: ClanContext, discordId: number) {
    const isInClan = clan.members.some((x) => x.user.discordId == discordId);
    if (isInClan) {
      throw new Error('This user is already in the clan');
    }
  }
}
