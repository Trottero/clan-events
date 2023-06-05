import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Clan } from './clan.schema';
import { Board, BoardSchema } from './board.schema';
import { EventTeam, EventTeamSchema } from './event-team.schema';
import {
  EventActionSchema,
  registerEventActionsSchemas,
} from './event-action.schema';
import { EventVisibility } from '@common/events';

export type EventDocument = mongoose.HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Clan' })
  owner?: Clan;

  @Prop({
    type: String,
    default: EventVisibility.Private,
    enum: Object.values(EventVisibility),
  })
  visibility: EventVisibility;

  @Prop()
  startsAt: Date;

  @Prop()
  endsAt: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: [EventTeamSchema] })
  participants: EventTeam[];

  @Prop({ type: BoardSchema, required: true })
  board: Board;

  @Prop({ type: [EventActionSchema] })
  actions: unknown[];
}

export const EventSchema = SchemaFactory.createForClass(Event);

const actionsArray = EventSchema.path(
  'actions',
) as mongoose.Schema.Types.DocumentArray;
registerEventActionsSchemas(actionsArray);
