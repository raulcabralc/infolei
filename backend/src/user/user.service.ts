import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDTO } from "./dtos/create-user.dto";
import { UserRole } from "./enums/user-role.enum";

import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(
    userDTO: CreateUserDTO,
  ): Promise<CreateUserDTO | ConflictException | BadRequestException> {
    try {
      const userAlreadyExists = await this.userRepository.findByEmail(
        userDTO.email,
      );

      if (userAlreadyExists) {
        throw new ConflictException("This email is already registered");
      }

      if (userDTO.password.length < 6) {
        throw new BadRequestException("Password must be at least 6 characters");
      }

      const hashedPassword = await bcrypt.hash(userDTO.password, 10);

      const user = {
        name: userDTO.name,
        email: userDTO.email,
        password: hashedPassword,
        bio: userDTO.bio || undefined,
        interestTags: userDTO.interestTags,
      };

      const createdUser = await this.userRepository.create(user);

      return createdUser;
    } catch (error) {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  async delete(userId: string): Promise<CreateUserDTO | NotFoundException> {
    try {
      const deletedUser = await this.userRepository.delete(userId);

      return deletedUser || new NotFoundException("User not found");
    } catch (error) {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }
}
