import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Clan } from './clan.schema';

export type EventDocument = mongoose.HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Clan', required: true })
  owner: Clan;

  @Prop()
  startDate: Date;
  @Prop()
  endDate: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
