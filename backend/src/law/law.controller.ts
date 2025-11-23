import {
  Controller,
  Delete,
  Get,
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

  @Post("/sync")
  async sync() {
    return this.lawService.syncFromCamara();
  }

  @Delete("/delete-all")
  async deleteAll() {
    return this.lawService.deleteAll();
  }
}
