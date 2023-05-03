import { Controller, Get, Post } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { UserService } from './user.service';

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
}
