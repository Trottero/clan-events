import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Clan } from './clan.schema';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Clan' })
  primaryClan: Clan;

  @Prop()
  discordId: number;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
