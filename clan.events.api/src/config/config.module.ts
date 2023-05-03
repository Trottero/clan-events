import { Module } from '@nestjs/common';

import { ConfigModule as nestjsConfig } from '@nestjs/config';
import config from './config';
import { MongooseConfigService } from './mongoose.config.service';

@Module({
  imports: [
    nestjsConfig.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  providers: [MongooseConfigService],
})
export class ConfigModule {}
