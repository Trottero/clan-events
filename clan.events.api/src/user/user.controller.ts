import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from 'src/database/schemas/user.schema';
import { User as UserDecorator } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';
import { ApiTokenGuard } from 'src/auth/guards/api-token.guard';
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

  @UseGuards(ApiTokenGuard)
  @Get('me')
  async getSelf(@UserDecorator() user: JwtTokenContent): Promise<User> {
    return await this.userService.getOrCreateUser(
      user.discordId,
      user.username,
    );
  }
}
