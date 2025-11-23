import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { Types } from "mongoose";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/:id")
  async findOne(@Param("id") userId: string) {
    return this.userService.findOne(userId);
  }

  @Post("/register")
  async create(@Body() userDTO: CreateUserDTO) {
    return this.userService.create(userDTO);
  }

  @Patch("/update/:id")
  async updateInterestTags(
    @Param("id") userId: string,
    @Body("interestTags") interestTags: string[],
  ) {
    let objectIdTags: Types.ObjectId[] = [];

    if (interestTags && Array.isArray(interestTags)) {
      try {
        objectIdTags = interestTags.map((tag) => new Types.ObjectId(tag));
      } catch (error) {
        throw new BadRequestException("Invalid ID format in interest tags");
      }
    }

    return this.userService.updateInterestTags(userId, objectIdTags);
  }

  @Delete("/delete/:id")
  async delete(@Param("id") userId: string) {
    return this.userService.delete(userId);
  }
}
