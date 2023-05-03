import { Module } from '@nestjs/common';
import { DiscordUserService } from './discord.user.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [DiscordUserService],
  exports: [DiscordUserService],
})
export class DiscordModule {}
