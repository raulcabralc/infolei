import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDTO } from "./dtos/create-user.dto";

@Injectable()
export class UserRepository {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async create(user: CreateUserDTO): Promise<User> {
    return (await this.userModel.create(user)).populate("interestTags", "name");
  }

  async delete(userId: string): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }
}
