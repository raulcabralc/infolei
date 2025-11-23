import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO } from "./dtos/create-category.dto";
import { Category } from "./category.schema";

@Controller("/category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post("/create")
  async create(
    @Body() categoryDTO: CreateCategoryDTO,
  ): Promise<Category | null> {
    return await this.categoryService.create(categoryDTO);
  }

  @Get("/")
  async index(): Promise<Category[]> {
    return await this.categoryService.index();
  }

  @Patch("/update/:id")
  async update(
    @Param("id") id: string,
    categoryDTO: CreateCategoryDTO,
  ): Promise<Category | null> {
    return await this.categoryService.update(id, categoryDTO);
  }

  @Delete("/delete/:id")
  async delete(@Param("id") id: string): Promise<Category | null> {
    return await this.categoryService.delete(id);
  }
}
