import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../configuration/secrets/auth-constants";
import { UsersService } from "../users/users.service";
import { UserRepositoryService } from "src/users/repositories/user.repository.service";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [AuthService, UsersService, UserRepositoryService],
})
export class AuthModule {}
