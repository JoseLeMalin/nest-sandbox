import { CommonEntity } from "../../infrastructure/database/entities/common.entity";
export interface UserEntity extends CommonEntity {
  first_name: string;
  gender: "man" | "woman" | "other" | "unknown";

  // If the column is nullable in the database, make its type nullable.
  // Don't use optional properties. Optionality is always determined
  // automatically by Kysely.
  last_name: string | null;
}
