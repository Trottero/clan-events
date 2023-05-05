import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClanRole } from 'src/database/models/auth.role';
import { Clan, ClanDocument } from 'src/database/schemas/clan.schema';
import { User } from 'src/database/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ClanService {
  constructor(
    @InjectModel(Clan.name) private clanModel: Model<Clan>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userService: UserService,
  ) {}

  async createRandomClan(): Promise<Clan> {
    const randomUser = await this.userService.createRandomUser();
    const displayName = 'Clan ' + Math.floor(Math.random() * 1000);
    const clan = new this.clanModel({
      members: [],
      displayName: displayName,
      name: this.convertToSafeName(displayName),
      owner: randomUser,
    });
    return clan.save();
  }

  async createClan(displayName: string): Promise<ClanDocument> {
    // Sanatize the display name
    const clan = new this.clanModel({
      name: this.convertToSafeName(displayName),
      displayName: displayName,
    });
    await clan.save();

    return this.getClanByName(displayName);
  }

  async deleteClan(name: string, ownerDiscordId: number) {
    const safeName = this.convertToSafeName(name);
    const clan = await this.getClanByName(name);
    if (!clan) {
      return;
    }

    if (
      clan.members?.length &&
      !clan.members.find(
        (x) => x.user.discordId == ownerDiscordId && x.role === ClanRole.Owner,
      )
    ) {
      throw new Error('You are not the owner of this clan');
    }

    await this.clanModel.deleteOne({ name: safeName }).exec();
  }

  async getAllClans(): Promise<Clan[]> {
    return this.clanModel.find().exec();
  }

  async getClanByName(clanName: string): Promise<ClanDocument> {
    return await this.clanModel
      .findOne({ name: this.convertToSafeName(clanName) })
      .populate({
        path: 'members',
        populate: { path: 'user', model: this.userModel, select: '-clans' },
      })
      .exec();
  }

  private convertToSafeName(name: string): string {
    // Remove all non-alphanumeric characters
    let safeName = name.replace(/[^a-zA-Z0-9 \-]/g, '');
    // Convert to lowercase
    safeName = safeName.toLowerCase();
    // Truncate to 30 characters
    safeName = safeName.substring(0, 30);
    // replace spaces with dashes
    safeName = safeName.replace(/\s/g, '-');
    return safeName;
  }
}
