import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Law } from "./law.schema";
import { CreateLawDTO } from "./dtos/create-law.dto";

@Injectable()
export class LawRepository {
  constructor(@InjectModel("Law") private readonly lawModel: Model<Law>) {}

  async index(
    filters: any,
    skip: number,
    limit: number,
    page: number,
  ): Promise<any> {
    const [data, total] = await Promise.all([
      this.lawModel
        .find(filters)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category", "name description iconUrl colorHex slug")
        .exec(),
      this.lawModel.countDocuments(filters).exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOneByOfficialTitle(value: string) {
    return await this.lawModel.findOne({ officialTitle: value });
  }

  async create(law: CreateLawDTO): Promise<Law> {
    return this.lawModel.create(law);
  }

  async deleteAll() {
    return await this.lawModel.deleteMany();
  }
}
