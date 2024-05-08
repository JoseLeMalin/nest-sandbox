import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { WsModule } from "./ws/ws.module";
import { AppDataSource } from "./data-source";
import { DataSource } from "typeorm";
import { ConfigModule } from "@nestjs/config";
import config from "src/config/configuration";


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    UsersModule,
    WsModule,
    AppDataSource,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
