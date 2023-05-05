import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ClanRole } from 'src/database/models/auth.role';
import { InjectModel } from '@nestjs/mongoose';
import { Model, HydratedDocument } from 'mongoose';
import { Clan, ClanDocument } from 'src/database/schemas/clan.schema';
import { User } from 'src/database/schemas/user.schema';
import { ClanMembership } from 'src/database/schemas/clan-membership.schema';

@Injectable()
export class ClanMembershipService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Clan.name) private clanModel: Model<Clan>,
    @InjectModel(User.name) private userModel: Model<User>,
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

  async removeMemberFromClan(clan: ClanDocument, discordUserId: number) {
    const user = await this.userService.getUserForDiscordId(discordUserId);

    if (!user) {
      throw new Error('User not found');
    }

    await clan.updateOne({ $pull: { members: { user: user._id } } }).exec();
    await user.updateOne({ $pull: { clans: { clan: clan._id } } }).exec();
  }

  async updateMemberRole(
    clan: ClanDocument,
    discordUserId: number,
    role: ClanRole,
  ) {
    const user = await this.userService.getUserForDiscordId(discordUserId);

    if (!user) {
      throw new Error('User not found');
    }

    const membership = new this.clanMembershipModel({
      clan: clan,
      user: user,
      role: role,
    });

    await clan.updateOne({ $pull: { members: { user: user._id } } }).exec();
    await clan.updateOne({ $push: { members: membership } }).exec();

    await user.updateOne({ $pull: { clans: { clan: clan._id } } }).exec();
    await user.updateOne({ $push: { clans: membership } }).exec();
  }
}
