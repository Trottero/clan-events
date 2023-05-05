import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Clan } from './clan.schema';
import { User } from './user.schema';
import { ClanRole } from '../models/auth.role';
import mongoose from 'mongoose';

export type ClanMembershipDocument = mongoose.HydratedDocument<ClanMembership>;

@Schema({ _id: false })
export class ClanMembership {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Clan' })
  clan: Clan;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  role: ClanRole;
}

export const ClanMembershipSchema =
  SchemaFactory.createForClass(ClanMembership);
