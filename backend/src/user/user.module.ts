import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { AiModule } from "src/ai/ai.module";
import { CategoryModule } from "src/category/category.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),

    AiModule,
    CategoryModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [],
})
export class UserModule {}
