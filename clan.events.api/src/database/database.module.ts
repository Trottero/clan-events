import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from 'src/config/config.module';
import { MongooseConfigService } from 'src/config/mongoose.config.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
})
export class DatabaseModule {}
