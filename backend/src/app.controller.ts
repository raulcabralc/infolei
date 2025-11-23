import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { AiService } from "./ai/ai.service";

@Controller()
export class AppController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
    private readonly aiService: AiService,
  ) {}

  @Get()
  async status(): Promise<Object> {
    return {
      status: "ok",
      db: this.mongoConnection.readyState === 1 ? "ok" : "n/a",
      ai: (await this.aiService.checkConnection()) ? "ok" : "n/a",
    };
  }
}
