import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tile, TileSchema } from './tile.schema';

export enum BoardType {
  Tilerace = 'TILERACE',
  Bingo = 'BINGO',
}

@Schema({ _id: false })
export class Board {
  @Prop({ type: String, required: true, enum: Object.values(BoardType) })
  type: BoardType;

  @Prop({ type: [TileSchema], required: true })
  tiles: Tile[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
