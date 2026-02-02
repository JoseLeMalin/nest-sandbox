import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DatabaseTables } from "../../infrastructure/database/entities/database.tables";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.POSTGRES_DB || "test",
    host: process.env.POSTGRES_HOST || "localhost",
    user: process.env.POSTGRES_USER || "admin",
    password: process.env.POSTGRES_PASSWORD || "password",
    port: parseInt(process.env.POSTGRESDB_LOCAL_PORT || "5440", 10),
    max: 10,
  }),
});

export const postgresDB = new Kysely<DatabaseTables>({
  dialect,
});
