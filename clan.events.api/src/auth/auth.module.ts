import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { DiscordModule } from 'src/discord/discord.module';

@Module({
  imports: [HttpModule, DiscordModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
