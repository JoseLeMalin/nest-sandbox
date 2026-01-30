import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DatabaseTables } from "../../infrastructure/database/entities/database.tables";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "test",
    host: "localhost",
    user: "admin",
    port: 5434,
    max: 10,
  }),
});

export const postgresDB = new Kysely<DatabaseTables>({
  dialect,
});
