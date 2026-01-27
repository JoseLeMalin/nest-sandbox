import { Injectable } from "@nestjs/common";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

import { DatabaseTables } from "../../infrastructure/database/entities/database.tables";

@Injectable()
export class PostgresService {
  private dialect = new PostgresDialect({
    pool: new Pool({
      database: "test",
      host: "localhost",
      user: "admin",
      port: 5434,
      max: 10,
    }),
  });

  public readonly postgresDB = new Kysely<DatabaseTables>({
    dialect: this.dialect,
  });
}
