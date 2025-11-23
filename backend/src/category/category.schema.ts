import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  iconUrl: string;

  @Prop({ required: true, default: "#CCCCCC" })
  colorHex: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
