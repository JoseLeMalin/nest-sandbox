import { Module } from "@nestjs/common";
import { VotesModule } from "./votes/votes.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [AuthModule, VotesModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
