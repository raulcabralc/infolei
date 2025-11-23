import { IsArray, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  interestTags?: string[];
}
