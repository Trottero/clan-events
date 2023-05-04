import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Challenge, ChallengeSchema } from './challenge.schema';

@Schema()
export class Tile {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' })
  nextTile?: Tile;

  @Prop({ type: [ChallengeSchema] })
  challenges: Challenge[];
}

export const TileSchema = SchemaFactory.createForClass(Tile);
