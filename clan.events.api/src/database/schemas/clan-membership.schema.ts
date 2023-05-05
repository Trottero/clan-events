import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Clan, ClanDocument } from './clan.schema';
import { User, UserDocument } from './user.schema';
import { ClanRole } from '../models/auth.role';
import mongoose from 'mongoose';

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
