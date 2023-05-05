import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tile, TileSchema } from './tile.schema';
import { BoardType } from 'clan.events.common/events';

@Schema({ _id: false })
export class Board {
  @Prop({ type: String, required: true, enum: Object.values(BoardType) })
  type: BoardType;

  @Prop({ type: [TileSchema], required: true, default: [] })
  tiles: Tile[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
