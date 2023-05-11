import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clan, ClanDocument } from 'src/database/schemas/clan.schema';
import { User } from 'src/database/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { ClanMembershipService } from './clan-membership.service';
import { ClanRole } from '@common/auth/clan.role';
import { ClanWithRole, sanitizeClanName } from '@common/clan';

@Injectable()
export class ClanService {
  constructor(
    @InjectModel(Clan.name) private clanModel: Model<Clan>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService: UserService,
    private readonly membershipService: ClanMembershipService,
  ) {}

  async getClansForUser(userId: string): Promise<ClanWithRole[]> {
    const user = await (
      await this.userService.getUserById(userId)
    ).populate({
      path: 'clans',
      populate: { path: 'clan', model: this.clanModel, select: '-members' },
    });

    return user.clans.map((x) => {
      return {
        name: x.clan.name,
        displayName: x.clan.displayName,
        role: x.role,
        members: null,
      };
    });
  }

  async createRandomClan(): Promise<Clan> {
    const randomUser = await this.userService.createRandomUser();
    const displayName = 'Clan ' + Math.floor(Math.random() * 1000);
    const clan = new this.clanModel({
      members: [],
      displayName: displayName,
      name: sanitizeClanName(displayName),
      owner: randomUser,
    });
    return clan.save();
  }

  async createClan(displayName: string): Promise<ClanDocument> {
    const clan = new this.clanModel({
      name: sanitizeClanName(displayName),
      displayName: displayName,
    });
    await clan.save();

    return this.getClanByName(displayName);
  }

  async deleteClan(name: string, ownerDiscordId: number) {
    const safeName = sanitizeClanName(name);
    const clan = await this.getClanByName(name);
    if (!clan) {
      throw new Error('Clan not found');
    }

    if (
      clan.members?.length &&
      !clan.members.find(
        (x) => x.user.discordId == ownerDiscordId && x.role === ClanRole.Owner,
      )
    ) {
      throw new Error('You are not the owner of this clan');
    }

    const clanToDelete = await this.clanModel
      .findOne({ name: safeName })
      .populate({
        path: 'members',
        populate: {
          path: 'user',
          model: this.userModel,
        },
      })
      .exec();

    await this.userModel
      .updateMany(
        {
          _id: {
            $in: clanToDelete.members.map((ship) => ship.user._id),
          },
        },
        { $pull: { clans: { clan: clanToDelete._id } } },
      )
      .exec();

    await this.clanModel.deleteOne({ name: safeName }).exec();
  }

  async getClanByName(clanName: string): Promise<ClanDocument> {
    return await this.clanModel
      .findOne({ name: sanitizeClanName(clanName) })
      .populate({
        path: 'members',
        populate: { path: 'user', model: this.userModel, select: '-clans' },
      })
      .exec();
  }
}
