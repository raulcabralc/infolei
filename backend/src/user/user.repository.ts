import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./user.schema";
import { CreateUserDTO } from "./dtos/create-user.dto";

@Injectable()
export class UserRepository {
  constructor(@InjectModel("User") private readonly userModel: Model<User>) {}

  async create(user: CreateUserDTO): Promise<User> {
    return this.userModel.create(user);
  }

  async delete(userId: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}
