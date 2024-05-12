import { Module } from "@nestjs/common";import { ItemsService } from "./items.service";import { ItemsController } from "./items.controller";import { TypeOrmModule } from "@nestjs/typeorm";import { Item } from "./entities/item.entity";import { CreateClass, UpdateClass } from "src/utils/querybuilders/genericfunctions";@Module({  imports: [TypeOrmModule.forFeature([Item]), CreateClass, UpdateClass],  controllers: [ItemsController],  providers: [ItemsService],  exports: [ItemsService],})export class ItemsModule {}