import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/database/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createRandomUser(): Promise<User> {
    const user = new this.userModel({
      discordId: Math.floor(Math.random() * 100000000),
      name: 'User ' + Math.floor(Math.random() * 1000),
      primaryClan: null,
      clans: [],
    });
    return user.save();
  }

  async getUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async getOrCreateUser(
    discordId: number,
    name: string,
  ): Promise<UserDocument> {
    const existingUser = await this.getUserForDiscordId(discordId);
    if (existingUser) {
      return existingUser;
    }

    const user = new this.userModel({
      discordId: discordId,
      name: name,
      primaryClan: null,
    });
    return user.save();
  }

  async getUserForDiscordId(discordId: number): Promise<UserDocument> {
    return this.userModel.findOne({ discordId: discordId }).exec();
  }

  async getUserByUsername(username: string): Promise<UserDocument> {
    return this.userModel.findOne({ name: username }).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
