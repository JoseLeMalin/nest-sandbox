import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { WsModule } from "./ws/ws.module";
import { AppDataSource } from "./data-source";
import { DataSource } from "typeorm";
import { ConfigModule } from "@nestjs/config";
import { ItemsModule } from "./items/items.module";
import { UtilsModule } from "./utils/utils.module";
// import config from "src/config/configuration";

@Module({
  imports: [
    AppDataSource,
    ConfigModule.forRoot({
      //  load: [config],
    }),
    UsersModule,
    ItemsModule,
    WsModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    // dataSource
    //   .initialize()
    //   .then(() => {
    //     console.log("Data Source has been initialized!");
    //   })
    //   .catch((err) => {
    //     console.error("Error during Data Source initialization:", err);
    //   });
  }
}
