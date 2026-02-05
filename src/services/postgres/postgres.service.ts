import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Kysely } from "kysely";
import { DatabaseTables } from "../../infrastructure/database/entities/database.tables";
import {
  getKyselyInstance,
  destroyKyselyInstance,
} from "../../configuration/database/datasource";

/**
 * NestJS service wrapper for Kysely database instance.
 * Provides the singleton Kysely instance and handles cleanup on shutdown.
 */
@Injectable()
export class PostgresService implements OnModuleDestroy {
  public readonly db: Kysely<DatabaseTables>;

  constructor() {
    // Use the singleton instance
    this.db = getKyselyInstance();
  }

  /**
   * Cleanup database connections when the NestJS module is destroyed.
   */
  async onModuleDestroy() {
    await destroyKyselyInstance();
  }

  /**
   * Get the Kysely instance directly.
   * Use this.db is preferred, but this method is provided for flexibility.
   */
  getDb(): Kysely<DatabaseTables> {
    return this.db;
  }
}
