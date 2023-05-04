import { Module } from '@nestjs/common';
import { DiscordUserService } from './discord.user.service';
import { HttpModule } from '@nestjs/axios';
import { DiscordAuthService } from './discord.auth.service';

@Module({
  imports: [HttpModule],
  providers: [DiscordUserService, DiscordAuthService],
  exports: [DiscordUserService, DiscordAuthService],
})
export class DiscordModule {}
