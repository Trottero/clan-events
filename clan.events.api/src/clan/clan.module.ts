import { Module } from '@nestjs/common';
import { ClanService } from './clan.service';
import { ClanController } from './clan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Clan, ClanSchema } from 'src/database/schemas/clan.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Clan.name, schema: ClanSchema }]),
  ],
  controllers: [ClanController],
  providers: [ClanService],
  exports: [ClanService],
})
export class ClanModule {}
