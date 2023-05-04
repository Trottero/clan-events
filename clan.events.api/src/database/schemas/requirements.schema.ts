import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum RequirementType {
  Item = 'ITEM',
}

@Schema({ _id: false, discriminatorKey: 'type' })
export class Requirement {
  @Prop({ required: true })
  type: RequirementType;
}

@Schema({ _id: false })
export class ItemRequirement {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  amount: number;
}

export const RequirementSchema = SchemaFactory.createForClass(Requirement);
export const ItemRequirementSchema =
  SchemaFactory.createForClass(ItemRequirement);
