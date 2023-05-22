import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type ImageDocument = mongoose.HydratedDocument<Image>;

@Schema()
export class Image {
  @Prop()
  mimeType: string;

  @Prop()
  buffer: Buffer;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
