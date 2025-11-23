import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateLawDTO {
  @IsString()
  officialTitle: string;

  @IsString()
  popularTitle: string;

  @IsString()
  category: Types.ObjectId;

  @IsDate()
  publishDate: Date;

  @IsString()
  imageUrl: string;

  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsString()
  impactPoints?: string[];

  @IsString()
  sourceUrl: string;
}
