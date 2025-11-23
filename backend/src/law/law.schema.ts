import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Law extends Document {
  @Prop({ required: true })
  officialTitle: string;

  @Prop({ required: true })
  popularTitle: string;

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  publishDate: Date;

  @Prop()
  imageUrl: string;

  @Prop({ required: true, maxlength: 250 })
  shortDescription: string;

  @Prop({ required: false })
  longDescription?: string;

  @Prop({ type: [String], required: false })
  impactPoints?: string[];

  @Prop()
  sourceUrl: string;
}

export const LawSchema = SchemaFactory.createForClass(Law);
