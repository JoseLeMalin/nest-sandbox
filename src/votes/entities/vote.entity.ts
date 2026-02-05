import { Insertable, Selectable, Updateable } from "kysely";
import { CommonEntity } from "../../infrastructure/database/entities/common.entity";

/**
 * Represents the 'vote' table in the database.
 */
export interface VoteTable extends CommonEntity {
  user_id: number;
  vote_type: "upvote" | "downvote";
  target_id: number;
  target_type: string;
}

// Type-safe helpers for different operations
export type Vote = Selectable<VoteTable>;
export type NewVote = Insertable<VoteTable>;
export type VoteUpdate = Updateable<VoteTable>;
