import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDTO } from "./dtos/create-user.dto";

@Controller("/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/register")
  async create(@Body() userDTO: CreateUserDTO) {
    return this.userService.create(userDTO);
  }

  @Delete("/delete/:id")
  async delete(@Param("id") userId: string) {
    return this.userService.delete(userId);
  }
}
