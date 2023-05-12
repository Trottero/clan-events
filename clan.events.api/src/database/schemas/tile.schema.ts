import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Challenge, ChallengeSchema } from './challenge.schema';
import { CanvasTile, CanvasTileSchema } from './canvas-tile.schema';

export type TileDocument = mongoose.HydratedDocument<Tile>;

@Schema()
export class Tile {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' })
  nextTile?: Tile;

  @Prop({ type: [ChallengeSchema] })
  challenges: Challenge[];

  @Prop({ type: CanvasTileSchema, required: true })
  canvas: CanvasTile;
}

export const TileSchema = SchemaFactory.createForClass(Tile);
