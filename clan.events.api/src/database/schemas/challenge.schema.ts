import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Tile } from './tile.schema';
import mongoose from 'mongoose';
import {
  ItemRequirementSchema,
  RequirementSchema,
  RequirementType,
} from './requirements.schema';

@Schema({ _id: false })
export class Challenge {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tile' })
  nextTile?: Tile;

  @Prop({ type: [RequirementSchema], required: true })
  requirements: unknown[];
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

const requirementsArraySchema = ChallengeSchema.path(
  'requirements',
) as mongoose.Schema.Types.DocumentArray;

requirementsArraySchema.discriminator(
  RequirementType.Item,
  ItemRequirementSchema,
);
