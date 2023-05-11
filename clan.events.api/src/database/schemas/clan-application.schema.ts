import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ClanApplicationDocument =
  mongoose.HydratedDocument<ClanApplication>;

@Schema()
export class ClanApplication {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Clan', index: true })
  clan: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;

  @Prop({ unique: true })
  discordId: number;

  @Prop({ unique: true })
  discordName: number;

  @Prop()
  createdAt?: Date;
}

export const ClanApplicationSchema =
  SchemaFactory.createForClass(ClanApplication);
