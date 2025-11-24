import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { LawService } from "./law.service";
import { LawsIndexDTO } from "./dtos/laws-index.dto";

@Controller("/law")
export class LawController {
  constructor(private readonly lawService: LawService) {}

  @Get("/")
  async index(
    @Query(new ValidationPipe({ transform: true })) queryDTO: LawsIndexDTO,
  ) {
    return this.lawService.index(queryDTO);
  }

  @Get("/:id")
  async findById(@Param("id") id: string) {
    return this.lawService.findById(id);
  }

  @Post("/sync-batch")
  async syncBatch(@Query("limit") limit: number) {
    return this.lawService.syncBatch(limit);
  }

  @Post("/sync")
  async sync() {
    return this.lawService.syncFromCamara();
  }

  @Delete("/delete-all")
  async deleteAll() {
    return this.lawService.deleteAll();
  }
}
