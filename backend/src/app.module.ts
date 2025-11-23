import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { CategoryModule } from "./category/category.module";
import { AiModule } from "./ai/ai.module";
import { LawModule } from "./law/law.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get("DB_URI") as string,
      }),
      inject: [ConfigService],
    }),

    //

    UserModule,
    CategoryModule,
    LawModule,
    AiModule,
  ],

  controllers: [AppController],
  providers: [],
})
export class AppModule {}
