import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClanDocument } from './clan.schema';
import { UserDocument } from './user.schema';
import mongoose from 'mongoose';
import { ClanRole } from '@common/auth/clan.role';

export type ClanMembershipDocument = mongoose.HydratedDocument<ClanMembership>;

@Schema({ _id: false })
export class ClanMembership {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Clan' })
  clan: ClanDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserDocument;

  @Prop({ type: String, enum: ClanRole })
  role: ClanRole;
}

export const ClanMembershipSchema =
  SchemaFactory.createForClass(ClanMembership);
