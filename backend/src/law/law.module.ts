import { Module } from "@nestjs/common";
import { LawService } from "./law.service";
import { LawRepository } from "./law.repository";
import { LawController } from "./law.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { LawSchema } from "./law.schema";
import { HttpModule } from "@nestjs/axios";
import { AiModule } from "src/ai/ai.module";
import { CategoryModule } from "src/category/category.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Law", schema: LawSchema }]),

    AiModule,
    CategoryModule,
    HttpModule,
  ],
  controllers: [LawController],
  providers: [LawService, LawRepository],
  exports: [],
})
export class LawModule {}
