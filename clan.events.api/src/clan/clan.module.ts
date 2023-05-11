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
import { ClanMembershipService } from './management/clan-membership.service';
import { AuthModule } from 'src/auth/auth.module';
import { ClanManagementController } from './management/clan-management.controller';
import {
  ClanApplication,
  ClanApplicationSchema,
} from 'src/database/schemas/clan-application.schema';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Clan.name, schema: ClanSchema },
      { name: ClanMembership.name, schema: ClanMembershipSchema },
      { name: ClanApplication.name, schema: ClanApplicationSchema },
    ]),
  ],
  controllers: [ClanController, ClanManagementController],
  providers: [ClanService, ClanMembershipService],
  exports: [ClanService, ClanMembershipService],
})
export class ClanModule {}
