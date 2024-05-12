import { Module } from "@nestjs/common";
import { UtilsService } from "./utils.service";
import { UtilsController } from "./utils.controller";
import { QuerybuildersModule } from "./querybuilders/querybuilders.module";
import { LoggersModule } from "./loggers/loggers.module";

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
  imports: [QuerybuildersModule, LoggersModule],
})
export class UtilsModule {}
