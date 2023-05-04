import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Clan } from './clan.schema';
import { User } from './user.schema';
import { Board, BoardSchema } from './board.schema';
import { EventTeam, EventTeamSchema } from './event-team.schema';

export type EventDocument = mongoose.HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Clan', required: true })
  owner: Clan;

  @Prop()
  startsAt: Date;
  @Prop()
  endsAt: Date;

  @Prop({ type: [EventTeamSchema] })
  participants: EventTeam[];

  @Prop({ type: BoardSchema, required: true })
  board: Board;
}

export const EventSchema = SchemaFactory.createForClass(Event);
