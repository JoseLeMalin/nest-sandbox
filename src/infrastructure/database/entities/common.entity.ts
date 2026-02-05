import { ColumnType, Generated } from "kysely";

/**
 * Common fields for all database tables.
 * Use this as a base for table interfaces (not classes).
 */
export interface CommonEntity {
  // Generated columns are automatically created by the database
  id: Generated<number>;

  // ColumnType allows different types for select/insert/update
  // Select: Date, Insert: string | Date | undefined, Update: string | Date
  created_at: ColumnType<Date, string | Date | undefined, string | Date>;
  updated_at: ColumnType<Date, string | Date | undefined, string | Date>;
}
