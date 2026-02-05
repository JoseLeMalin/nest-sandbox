import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { DatabaseTables } from "../../infrastructure/database/entities/database.tables";

/**
 * Singleton Kysely instance for PostgreSQL.
 * According to Kysely docs: "In most cases, you should only create a single
 * Kysely instance per database. Most dialects use a connection pool internally,
 * so there's no need to create a new instance for each request."
 */
let kyselyInstance: Kysely<DatabaseTables> | null = null;

export function getKyselyInstance(): Kysely<DatabaseTables> {
  if (!kyselyInstance) {
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

    kyselyInstance = new Kysely<DatabaseTables>({
      dialect,
      // Add logging for development (optional)
      log(event) {
        if (event.level === "query") {
          console.log("[Kysely Query]", {
            sql: event.query.sql,
            duration: `${event.queryDurationMillis}ms`,
          });
        }
        if (event.level === "error") {
          console.error("[Kysely Error]", {
            sql: event.query.sql,
            error: event.error,
          });
        }
      },
    });
  }

  return kyselyInstance;
}

/**
 * Destroys the Kysely instance and releases all connections.
 * Call this when shutting down your application.
 */
export async function destroyKyselyInstance(): Promise<void> {
  if (kyselyInstance) {
    await kyselyInstance.destroy();
    kyselyInstance = null;
  }
}

// Export the instance for backward compatibility
export const postgresDB = getKyselyInstance();
