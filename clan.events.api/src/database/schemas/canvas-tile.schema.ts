import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CanvasTile {
  @Prop()
  image?: string;

  @Prop()
  x: number;

  @Prop()
  y: number;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  fillColor: string;

  @Prop()
  borderWidth: number;

  @Prop()
  borderColor: string;
}

export const CanvasTileSchema = SchemaFactory.createForClass(CanvasTile);
