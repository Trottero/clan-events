import { Image } from './image.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tile, TileSchema } from './tile.schema';
import { BoardType } from '@common/events';
import { ImageSchema } from './image.schema';
import mongoose from 'mongoose';

@Schema({ _id: false })
export class Board {
  @Prop({ type: String, required: true, enum: Object.values(BoardType) })
  type: BoardType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' })
  startingTile?: mongoose.Types.ObjectId;

  @Prop({ type: [TileSchema], required: true, default: [] })
  tiles: Tile[];

  @Prop({ type: ImageSchema })
  background?: Image;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
