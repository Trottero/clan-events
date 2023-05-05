import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DiscordModule } from 'src/discord/discord.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './jwt/jwt-config.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    HttpModule,
    DiscordModule,
    UserModule,
    JwtModule.registerAsync({ global: true, useClass: JwtConfigService }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
