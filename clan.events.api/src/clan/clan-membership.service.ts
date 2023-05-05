import { Injectable } from '@nestjs/common';
import { ClanService } from './clan.service';
import { UserService } from 'src/user/user.service';
import { ClanRole } from 'src/database/models/auth.role';
import { InjectModel } from '@nestjs/mongoose';
import { ClanMembership } from 'src/database/schemas/clan-membership.schema';
import { Model, HydratedDocument } from 'mongoose';
import { Clan, ClanDocument } from 'src/database/schemas/clan.schema';
import { User } from 'src/database/schemas/user.schema';

@Injectable()
export class ClanMembershipService {
  constructor(
    private readonly clanService: ClanService,
    private readonly userService: UserService,
    @InjectModel(ClanMembership.name)
    private clanMembershipModel: Model<ClanMembership>,
  ) {}

  async addMemberToClan(
    clan: ClanDocument,
    discordUserId: number,
    role: ClanRole,
  ) {
    const user = (await this.userService.getUserForDiscordId(
      discordUserId,
    )) as HydratedDocument<User>;

    if (!user) {
      throw new Error('User not found');
    }

    const membership = new this.clanMembershipModel({
      clan: clan,
      user: user,
      role: role,
    });

    clan.members.push(membership);
    user.clans.push(membership);

    await clan.save();
    await user.save();
  }
}
