import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose from 'mongoose';
import { Tile } from './tile.schema';

@Schema()
export class EventTeam {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' })
  tile?: Tile;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];
}

export const EventTeamSchema = SchemaFactory.createForClass(EventTeam);
