import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { UserClanRoleParam as UserDecorator } from 'src/clan/clan-role/user-clan-role.param';
import { UserService } from './user.service';
import { EnsureApiTokenGuard } from 'src/auth/guards/ensure-api-token.guard';
import { JwtTokenContent } from '@common/auth';

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

  @UseGuards(EnsureApiTokenGuard)
  @Get('me')
  async getSelf(@UserDecorator() user: JwtTokenContent): Promise<User> {
    return await this.userService.getOrCreateUser(
      user.discordId,
      user.username,
    );
  }
}
