import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useClass: ConfigService,
    }),
  ],
})
export class DatabaseModule {}
