import { IsHexColor, IsString, IsUrl } from "class-validator";

export class CreateCategoryDTO {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  slug: string;

  @IsString()
  @IsUrl()
  iconUrl: string;

  @IsString()
  @IsHexColor()
  colorHex: string;
}
