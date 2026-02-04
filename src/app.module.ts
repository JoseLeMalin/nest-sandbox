import { Module } from "@nestjs/common";

import { VotesModule } from "./votes/votes.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PostgresService } from "./services/postgres/postgres.service";

@Module({
  imports: [AuthModule, VotesModule, UsersModule],
  controllers: [],
  providers: [PostgresService],
})
export class AppModule {}
