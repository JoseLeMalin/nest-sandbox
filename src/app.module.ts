import { Module, Global } from "@nestjs/common";

import { VotesModule } from "./votes/votes.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PostgresService } from "./services/postgres/postgres.service";

/**
 * Make PostgresService global so it can be injected anywhere without importing the module.
 * This follows NestJS best practices for database connections.
 */
@Global()
@Module({
  providers: [PostgresService],
  exports: [PostgresService],
})
class DatabaseModule {}

@Module({
  imports: [DatabaseModule, AuthModule, VotesModule, UsersModule],
  controllers: [],
})
export class AppModule {}
