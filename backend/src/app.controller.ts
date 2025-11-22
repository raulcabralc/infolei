import { Controller, Get } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Controller()
export class AppController {
  constructor(
    @InjectConnection() private readonly mongoConnection: Connection,
  ) {}

  @Get()
  status(): object {
    return {
      status: "ok",
      db: this.mongoConnection.readyState === 1 ? "ok" : "n/a",
    };
  }
}
