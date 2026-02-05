import { Insertable, Selectable, Updateable } from "kysely";
import { CommonEntity } from "../../infrastructure/database/entities/common.entity";

/**
 * Represents the 'user' table in the database.
 * This is the table schema interface - use the type helpers below for operations.
 */
export interface UserTable extends CommonEntity {
  first_name: string;
  last_name: string | null;
  gender: "man" | "woman" | "other" | "unknown";
}

// Type-safe helpers for different operations
export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
