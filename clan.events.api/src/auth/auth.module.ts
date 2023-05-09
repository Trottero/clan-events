import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { DiscordModule } from 'src/discord/discord.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt/jwt-config.service';
import { UserModule } from 'src/user/user.module';
import { CachedRolesService } from './services/cached-roles.service';

@Module({
  imports: [
    HttpModule,
    DiscordModule,
    UserModule,
    JwtModule.registerAsync({ global: true, useClass: JwtConfigService }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, CachedRolesService],
  exports: [AuthService, CachedRolesService],
})
export class AuthModule {}
