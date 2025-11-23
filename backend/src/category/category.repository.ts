import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Category } from "./category.schema";
import { Model } from "mongoose";
import { CreateCategoryDTO } from "./dtos/create-category.dto";
import { UpdateCategoryDTO } from "./dtos/update-category.dto";

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectModel("Category") private readonly categoryModel: Model<Category>,
  ) {}

  async create(category: CreateCategoryDTO): Promise<Category> {
    return await this.categoryModel.create(category);
  }

  async index(): Promise<Category[]> {
    return await this.categoryModel.find();
  }

  async findOneByName(name: string) {
    return await this.categoryModel.findOne({ name });
  }

  async update(
    id: string,
    category: UpdateCategoryDTO,
  ): Promise<Category | null> {
    return await this.categoryModel.findByIdAndUpdate(id, category);
  }

  async delete(id: string): Promise<Category | null> {
    return await this.categoryModel.findByIdAndDelete(id);
  }
}
