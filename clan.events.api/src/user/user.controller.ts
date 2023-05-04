import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { UserService } from './user.service';
import { JwtTokenContent } from 'src/auth/models/jwt.token';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get('random')
  async createRandomUser(): Promise<User> {
    return await this.userService.createRandomUser();
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Request() req): Promise<User> {
    const jwt = req['user'] as JwtTokenContent;
    return await this.userService.getOrCreateUser(jwt.sub, jwt.username);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getSelf(@Request() req): Promise<User> {
    const jwt = req['user'] as JwtTokenContent;
    return await this.userService.getUserForDiscordId(jwt.sub);
  }
}
