import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { UserService } from './user.service';
import { DiscordAuthorizationInfo } from 'src/discord/models/discord.auth.info';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly clanService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.clanService.getAllUsers();
  }

  @Post()
  async createUser(): Promise<User> {
    return await this.clanService.createUser(0, 'Test');
  }

  @Get('random')
  async createRandomUser(): Promise<User> {
    return await this.clanService.createRandomUser();
  }

  @UseGuards(AuthGuard)
  @Get('info')
  async getUserInfo(@Request() req): Promise<DiscordAuthorizationInfo> {
    return req['user'];
  }
}
