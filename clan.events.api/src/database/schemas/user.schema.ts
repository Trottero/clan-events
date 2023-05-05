import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ClanMembership, ClanMembershipSchema } from './clan-membership.schema';
import { Clan } from './clan.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Clan.name })
  primaryClan: Clan;

  @Prop({
    type: [ClanMembershipSchema],
  })
  clans: ClanMembership[];

  @Prop({ unique: true })
  discordId: number;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
