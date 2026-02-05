import { UserTable } from "../../../users/entities/user.entity";
import { VoteTable } from "../../../votes/entities/vote.entity";

/**
 * Database schema interface.
 * Maps table names to their schema interfaces.
 */
export interface DatabaseTables {
  user: UserTable;
  vote: VoteTable;
}
