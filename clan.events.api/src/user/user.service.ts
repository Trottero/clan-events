import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createRandomUser(): Promise<User> {
    const user = new this.userModel({
      discordId: 1234,
      name: 'User ' + Math.floor(Math.random() * 1000),
      primaryClan: null,
    });
    return user.save();
  }

  async createUser(discordId: number, name: string): Promise<User> {
    const user = new this.userModel({
      discordId: discordId,
      name: name,
      primaryClan: null,
    });
    return user.save();
  }

  async getUserForDiscordId(discordId: number): Promise<User> {
    return this.userModel.findOne({ discordId: discordId }).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
