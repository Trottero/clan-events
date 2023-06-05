import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tile } from './tile.schema';
import mongoose from 'mongoose';

export type ChallengeDocument = mongoose.HydratedDocument<Challenge>;

@Schema()
export class Challenge {
  id?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' })
  nextTile?: mongoose.Types.ObjectId;

  @Prop()
  description: string;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
