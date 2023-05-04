import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ClanMembership, ClanMembershipSchema } from './clan-membership.schema';

export type ClanDocument = mongoose.HydratedDocument<Clan>;

@Schema()
export class Clan {
  @Prop({ unique: true })
  name: string;

  @Prop()
  displayName: string;

  @Prop({ type: [ClanMembershipSchema] })
  members: ClanMembership[];
}

export const ClanSchema = SchemaFactory.createForClass(Clan);
