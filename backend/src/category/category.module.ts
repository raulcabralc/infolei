import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CategorySchema } from "./category.schema";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "./category.repository";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Category", schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
