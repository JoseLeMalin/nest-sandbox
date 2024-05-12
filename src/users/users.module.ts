import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { QuerybuildersService } from "src/utils/querybuilders/querybuilders.service";
import { LoggersService } from "src/utils/loggers/loggers.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, QuerybuildersService, LoggersService],
  exports: [UsersService],
})
export class UsersModule {}
