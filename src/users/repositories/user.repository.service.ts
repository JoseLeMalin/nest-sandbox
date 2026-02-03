import { DatabaseTables } from "../../infrastructure/database/entities/database.tables";
import { Injectable } from "@nestjs/common";
import { Kysely } from "kysely";

import { UserEntity } from "../entities/user.entity";

@Injectable()
export class UserRepositoryService {
  public async findUserById(
    db: Kysely<DatabaseTables>,
    id: number,
  ): Promise<UserEntity | undefined> {
    const user = await db
      .selectFrom("user")
      .where("id", "=", id)
      .selectAll("user")
      .executeTakeFirst();

    return user;
  }
}
