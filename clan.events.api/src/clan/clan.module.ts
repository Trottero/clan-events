import { Module } from '@nestjs/common';
import { ClanService } from './clan.service';
import { ClanController } from './clan.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Clan, ClanSchema } from 'src/database/schemas/clan.schema';
import { UserModule } from 'src/user/user.module';
import {
  ClanMembership,
  ClanMembershipSchema,
} from 'src/database/schemas/clan-membership.schema';
import { ClanMembershipService } from './clan-membership.service';
import { AuthModule } from 'src/auth/auth.module';
import { ClanManagementController } from './clan-management.controller';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Clan.name, schema: ClanSchema },
      { name: ClanMembership.name, schema: ClanMembershipSchema },
    ]),
  ],
  controllers: [ClanController, ClanManagementController],
  providers: [ClanService, ClanMembershipService],
  exports: [ClanService, ClanMembershipService],
})
export class ClanModule {}
