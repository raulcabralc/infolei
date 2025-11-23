import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryDTO } from "./dtos/create-category.dto";
import { Category } from "./category.schema";
import { CATEGORIES_SEED } from "src/seeds/categories.seed";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(categoryDTO: CreateCategoryDTO): Promise<Category | null> {
    try {
      return await this.categoryRepository.create(categoryDTO);
    } catch (error) {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  async index(): Promise<Category[]> {
    try {
      return await this.categoryRepository.index();
    } catch (error) {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  async update(
    id: string,
    categoryDTO: CreateCategoryDTO,
  ): Promise<Category | null> {
    try {
      return await this.categoryRepository.update(id, categoryDTO);
    } catch (error) {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  async delete(id: string): Promise<Category | null> {
    try {
      return await this.categoryRepository.delete(id);
    } catch (error) {
      throw new ServiceUnavailableException("An unknown error has occured.");
    }
  }

  // SEED

  async seed() {
    for (const category of CATEGORIES_SEED) {
      const exists = await this.categoryRepository.findOneByName(category.name);
      if (!exists) await this.categoryRepository.create(category);
    }

    return { message: "Categories seeded successfully." };
  }
}
