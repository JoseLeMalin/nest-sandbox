import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { WsModule } from "./ws/ws.module";
import { AppDataSource } from "./data-source";
import { ConfigModule } from "@nestjs/config";
import { ItemsModule } from "./items/items.module";
import { UtilsModule } from "./utils/utils.module";
import { QuerybuildersModule } from "./utils/querybuilders/querybuilders.module";
import { LoggersModule } from "./utils/loggers/loggers.module";
import { MapEsriModule } from './map-esri/map-esri.module';

@Module({
  imports: [
    AppDataSource,
    ConfigModule.forRoot({
      //  load: [config],
    }),
    ItemsModule,
    LoggersModule, 
    MapEsriModule,
    QuerybuildersModule,
    UsersModule,
    UtilsModule,
    WsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}