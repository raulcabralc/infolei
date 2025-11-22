import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  bio?: string;

  // CATEGORIAS QUE A IA VAI ADICIONAR BASEADO NO TEXTO ENVIADO DA BIO
  @Prop({ type: [String], default: [] })
  interestTags: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
