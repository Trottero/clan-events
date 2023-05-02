import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Clan } from 'src/database/schemas/clan.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ClanService {
  constructor(
    @InjectModel(Clan.name) private clanModel: Model<Clan>,
    private readonly userService: UserService,
  ) {}

  async createRandomClan(): Promise<Clan> {
    const randomUser = await this.userService.createRandomUser();
    const clan = new this.clanModel({
      members: [],
      name: 'Clan ' + Math.floor(Math.random() * 1000),
      owner: randomUser,
    });
    return clan.save();
  }

  async createClan(name: string, discordId: number): Promise<Clan> {
    const user = await this.userService.getUserForDiscordId(discordId);
    const clan = new this.clanModel({
      members: [],
      name: name,
      owner: user,
    });
    return clan.save();
  }

  async getAllClans(): Promise<Clan[]> {
    return this.clanModel.find().exec();
  }
}
