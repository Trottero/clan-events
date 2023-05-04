import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DiscordModule } from 'src/discord/discord.module';
import { TokenCacheService } from './token.cache.service';

@Module({
  imports: [HttpModule, DiscordModule, CacheModule.register()],
  controllers: [AuthController],
  providers: [AuthService, TokenCacheService],
  exports: [AuthService, TokenCacheService],
})
export class AuthModule {}
