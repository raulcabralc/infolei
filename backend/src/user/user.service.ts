import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDTO } from "./dtos/create-user.dto";

import * as bcrypt from "bcrypt";
import { AiService } from "src/ai/ai.service";
import { CategoryService } from "src/category/category.service";
import { Types } from "mongoose";
import { User } from "./user.schema";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly aiService: AiService,
    private readonly categoryService: CategoryService,
  ) {}

  async findOne(userId: string): Promise<User | NotFoundException> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

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

      const categoryIndex = await this.categoryService.index();

      if (!userDTO.bio && !userDTO.interestTags) {
        throw new BadRequestException("Bio or interest tags must be provided");
      }

      let aiData: any;

      if (userDTO.bio) {
        aiData = await this.aiService.analyzeBioAndClassifyUser(
          userDTO.bio,
          categoryIndex,
        );
      }

      const user = {
        name: userDTO.name,
        email: userDTO.email,
        password: hashedPassword,
        bio: userDTO.bio || undefined,
        interestTags: userDTO.interestTags || aiData,
      };

      const createdUser = await this.userRepository.create(user);

      return createdUser as unknown as CreateUserDTO;
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  async updateInterestTags(userId: string, interestTags: Types.ObjectId[]) {
    if (!interestTags || interestTags.length === 0) {
      throw new BadRequestException("Interest tags must be provided");
    }

    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const categories = await this.categoryService.index();

    for (const tag of interestTags) {
      if (!Types.ObjectId.isValid(tag)) {
        throw new BadRequestException("Invalid interest tag format");
      }
    }

    for (const tag of interestTags) {
      if (!categories.some((category) => category._id.equals(tag))) {
        throw new BadRequestException("Invalid interest tag");
      }
    }

    return await this.userRepository.updateInterestTags(userId, interestTags);
  }

  async delete(userId: string): Promise<CreateUserDTO | NotFoundException> {
    try {
      const deletedUser = await this.userRepository.delete(userId);

      return (
        (deletedUser as unknown as CreateUserDTO) ||
        new NotFoundException("User not found")
      );
    } catch (error) {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }
}
