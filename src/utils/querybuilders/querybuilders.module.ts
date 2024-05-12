import { Module } from "@nestjs/common";
import { QuerybuildersService } from "./querybuilders.service";
import { QuerybuildersController } from "./querybuilders.controller";
import { LoggersService } from "../loggers/loggers.service";

@Module({
  controllers: [QuerybuildersController],
  providers: [QuerybuildersService, LoggersService],
  exports: [QuerybuildersService],
})
export class QuerybuildersModule {}
