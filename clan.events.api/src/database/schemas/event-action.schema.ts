import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EventTeam } from './event-team.schema';
import { User } from './user.schema';
import { Tile } from './tile.schema';

export enum EventActionType {
  RollDice = 'ROLL_DICE',
  Move = 'MOVE',
}

@Schema({ _id: false, discriminatorKey: 'type' })
export class EventAction {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventTeam',
  })
  team: EventTeam;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  actor: User;

  @Prop({ required: true, enum: Object.values(EventActionType), type: String })
  type: EventActionType;

  @Prop({ required: true })
  performedAt: Date;
}

@Schema({ _id: false })
export class RollDiceEventAction {
  @Prop({ required: true, type: Number })
  roll: number;
}

@Schema({ _id: false })
export class MoveEventAction {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Tile' })
  destination: Tile;
}

export const EventActionSchema = SchemaFactory.createForClass(EventAction);
export const RollDiceEventActionSchema =
  SchemaFactory.createForClass(RollDiceEventAction);
export const MoveEventActionSchema =
  SchemaFactory.createForClass(MoveEventAction);

export function registerEventActionsSchemas(
  documentArray: mongoose.Schema.Types.DocumentArray,
) {
  documentArray.discriminator(
    EventActionType.RollDice,
    RollDiceEventActionSchema,
  );
  documentArray.discriminator(EventActionType.Move, MoveEventActionSchema);
}
