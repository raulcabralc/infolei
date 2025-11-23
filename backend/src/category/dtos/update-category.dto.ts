import { IsHexColor, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsString()
  @IsOptional()
  @IsHexColor()
  colorHex?: string;
}
