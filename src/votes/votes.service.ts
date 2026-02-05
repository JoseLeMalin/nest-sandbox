import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { CreateVoteDto } from "./dto/create-vote.dto";
import { UpdateVoteDto } from "./dto/update-vote.dto";
import { PostgresService } from "../services/postgres/postgres.service";
import { Vote, NewVote, VoteUpdate } from "./entities/vote.entity";
import { sql } from "kysely";

/**
 * Service handling vote business logic.
 * Demonstrates advanced Kysely features: JOINs, aggregations, CTEs, and transactions.
 */
@Injectable()
export class VotesService {
  constructor(private readonly postgresService: PostgresService) {}

  /**
   * Create a new vote with duplicate check.
   * Demonstrates INSERT with ON CONFLICT handling and transactions.
   */
  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    const newVote: NewVote = {
      user_id: createVoteDto.user_id,
      vote_type: createVoteDto.vote_type,
      target_id: createVoteDto.target_id,
      target_type: createVoteDto.target_type,
    };

    // Check if user exists first (demonstrates JOIN validation)
    const userExists = await this.postgresService.db
      .selectFrom("user")
      .select("id")
      .where("id", "=", newVote.user_id)
      .executeTakeFirst();

    if (!userExists) {
      throw new BadRequestException(`User with ID ${newVote.user_id} not found`);
    }

    try {
      // Insert vote with RETURNING clause
      return await this.postgresService.db
        .insertInto("vote")
        .values(newVote)
        .returningAll()
        .executeTakeFirstOrThrow();
    } catch (error: any) {
      // Handle unique constraint violations
      if (error.code === "23505") {
        throw new ConflictException(
          "User has already voted on this target",
        );
      }
      throw error;
    }
  }

  /**
   * Find all votes with optional filtering and JOIN with user data.
   * Demonstrates conditional queries, JOINs, and pagination.
   */
  async findAll(filters?: {
    user_id?: number;
    vote_type?: "upvote" | "downvote";
    target_type?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = this.postgresService.db
      .selectFrom("vote")
      .innerJoin("user", "user.id", "vote.user_id")
      .select([
        "vote.id",
        "vote.vote_type",
        "vote.target_id",
        "vote.target_type",
        "vote.created_at",
        "user.first_name",
        "user.last_name",
      ]);

    // Conditional filtering (immutable pattern)
    if (filters?.user_id) {
      query = query.where("vote.user_id", "=", filters.user_id);
    }

    if (filters?.vote_type) {
      query = query.where("vote.vote_type", "=", filters.vote_type);
    }

    if (filters?.target_type) {
      query = query.where("vote.target_type", "=", filters.target_type);
    }

    // Pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    // Order by most recent
    query = query.orderBy("vote.created_at", "desc");

    return await query.execute();
  }

  /**
   * Find one vote by ID with user information.
   * Demonstrates simple JOIN.
   */
  async findOne(id: number) {
    const vote = await this.postgresService.db
      .selectFrom("vote")
      .innerJoin("user", "user.id", "vote.user_id")
      .select([
        "vote.id",
        "vote.user_id",
        "vote.vote_type",
        "vote.target_id",
        "vote.target_type",
        "vote.created_at",
        "user.first_name",
        "user.last_name",
      ])
      .where("vote.id", "=", id)
      .executeTakeFirst();

    if (!vote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }

    return vote;
  }

  /**
   * Get vote statistics by target.
   * Demonstrates GROUP BY, aggregate functions, and conditional aggregations.
   */
  async getVoteStatsByTarget(targetType?: string) {
    let query = this.postgresService.db
      .selectFrom("vote")
      .select([
        "target_id",
        "target_type",
        (eb) => eb.fn.count<number>("id").as("total_votes"),
        (eb) =>
          sql<number>`COUNT(*) FILTER (WHERE vote_type = 'upvote')`.as(
            "upvotes",
          ),
        (eb) =>
          sql<number>`COUNT(*) FILTER (WHERE vote_type = 'downvote')`.as(
            "downvotes",
          ),
      ])
      .groupBy(["target_id", "target_type"]);

    if (targetType) {
      query = query.where("target_type", "=", targetType);
    }

    return await query.execute();
  }

  /**
   * Get vote score (upvotes - downvotes) for each target.
   * Demonstrates CASE WHEN and calculated fields.
   */
  async getVoteScores(targetType?: string) {
    let query = this.postgresService.db
      .selectFrom("vote")
      .select([
        "target_id",
        "target_type",
        (eb) =>
          sql<number>`
            SUM(CASE 
              WHEN ${eb.ref("vote_type")} = 'upvote' THEN 1 
              WHEN ${eb.ref("vote_type")} = 'downvote' THEN -1 
              ELSE 0 
            END)
          `.as("score"),
      ])
      .groupBy(["target_id", "target_type"]);

    if (targetType) {
      query = query.where("target_type", "=", targetType);
    }

    query = query.orderBy("score", "desc");

    return await query.execute();
  }

  /**
   * Get top voters (users with most votes).
   * Demonstrates complex JOINs with GROUP BY and ORDER BY.
   */
  async getTopVoters(limit: number = 10) {
    return await this.postgresService.db
      .selectFrom("vote")
      .innerJoin("user", "user.id", "vote.user_id")
      .select([
        "user.id",
        "user.first_name",
        "user.last_name",
        (eb) => eb.fn.count<number>("vote.id").as("vote_count"),
      ])
      .groupBy(["user.id", "user.first_name", "user.last_name"])
      .orderBy("vote_count", "desc")
      .limit(limit)
      .execute();
  }

  /**
   * Get vote distribution by user gender.
   * Demonstrates multi-table JOINs with aggregations.
   */
  async getVoteDistributionByGender() {
    return await this.postgresService.db
      .selectFrom("vote")
      .innerJoin("user", "user.id", "vote.user_id")
      .select([
        "user.gender",
        "vote.vote_type",
        (eb) => eb.fn.count<number>("vote.id").as("count"),
      ])
      .groupBy(["user.gender", "vote.vote_type"])
      .orderBy(["user.gender", "vote.vote_type"])
      .execute();
  }

  /**
   * Find votes with Common Table Expressions (CTE).
   * Demonstrates WITH clause for complex queries.
   */
  async findVotesWithScores(minScore: number = 0) {
    return await this.postgresService.db
      .with("vote_scores", (db) =>
        db
          .selectFrom("vote")
          .select([
            "target_id",
            "target_type",
            (eb) =>
              sql<number>`
                SUM(CASE 
                  WHEN ${eb.ref("vote_type")} = 'upvote' THEN 1 
                  WHEN ${eb.ref("vote_type")} = 'downvote' THEN -1 
                  ELSE 0 
                END)
              `.as("score"),
          ])
          .groupBy(["target_id", "target_type"]),
      )
      .selectFrom("vote_scores")
      .selectAll()
      .where("score", ">=", minScore)
      .orderBy("score", "desc")
      .execute();
  }

  /**
   * Toggle vote (change upvote to downvote or vice versa).
   * Demonstrates UPDATE with complex SET clause.
   */
  async toggleVote(id: number): Promise<Vote> {
    const updatedVote = await this.postgresService.db
      .updateTable("vote")
      .set({
        vote_type: sql`CASE 
          WHEN vote_type = 'upvote' THEN 'downvote'::text 
          WHEN vote_type = 'downvote' THEN 'upvote'::text 
        END`,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (!updatedVote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }

    return updatedVote;
  }

  /**
   * Update a vote.
   * Demonstrates conditional UPDATE.
   */
  async update(id: number, updateVoteDto: UpdateVoteDto): Promise<Vote> {
    const updateData: VoteUpdate = {};

    if (updateVoteDto.vote_type !== undefined) {
      updateData.vote_type = updateVoteDto.vote_type;
    }

    if (Object.keys(updateData).length === 0) {
      return await this.findOneById(id);
    }

    const updatedVote = await this.postgresService.db
      .updateTable("vote")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (!updatedVote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }

    return updatedVote;
  }

  /**
   * Delete a vote by ID.
   * Demonstrates DELETE with RETURNING.
   */
  async remove(id: number): Promise<Vote> {
    const deletedVote = await this.postgresService.db
      .deleteFrom("vote")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (!deletedVote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }

    return deletedVote;
  }

  /**
   * Delete all votes for a specific target.
   * Demonstrates bulk DELETE.
   */
  async removeByTarget(targetId: number, targetType: string): Promise<number> {
    const result = await this.postgresService.db
      .deleteFrom("vote")
      .where("target_id", "=", targetId)
      .where("target_type", "=", targetType)
      .executeTakeFirst();

    return Number(result.numDeletedRows);
  }

  /**
   * Batch create votes in a transaction.
   * Demonstrates transaction with multiple inserts.
   */
  async createBatch(votes: CreateVoteDto[]): Promise<Vote[]> {
    return await this.postgresService.db.transaction().execute(async (trx) => {
      const createdVotes: Vote[] = [];

      for (const voteDto of votes) {
        const newVote: NewVote = {
          user_id: voteDto.user_id,
          vote_type: voteDto.vote_type,
          target_id: voteDto.target_id,
          target_type: voteDto.target_type,
        };

        const vote = await trx
          .insertInto("vote")
          .values(newVote)
          .returningAll()
          .executeTakeFirstOrThrow();

        createdVotes.push(vote);
      }

      return createdVotes;
    });
  }

  /**
   * Get vote activity over time.
   * Demonstrates date functions and time-based grouping.
   */
  async getVoteActivity(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await this.postgresService.db
      .selectFrom("vote")
      .select([
        (eb) => sql<string>`DATE(${eb.ref("created_at")})`.as("date"),
        "vote_type",
        (eb) => eb.fn.count<number>("id").as("count"),
      ])
      .where("created_at", ">=", cutoffDate)
      .groupBy([sql`DATE(created_at)`, "vote_type"])
      .orderBy(sql`DATE(created_at)`, "desc")
      .execute();
  }

  /**
   * Check if user has voted on a target.
   * Demonstrates EXISTS subquery.
   */
  async hasUserVoted(
    userId: number,
    targetId: number,
    targetType: string,
  ): Promise<boolean> {
    const result = await this.postgresService.db
      .selectFrom("vote")
      .select((eb) => eb.fn.count<number>("id").as("count"))
      .where("user_id", "=", userId)
      .where("target_id", "=", targetId)
      .where("target_type", "=", targetType)
      .executeTakeFirstOrThrow();

    return Number(result.count) > 0;
  }

  /**
   * Helper method to find vote by ID without JOIN.
   */
  private async findOneById(id: number): Promise<Vote> {
    const vote = await this.postgresService.db
      .selectFrom("vote")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!vote) {
      throw new NotFoundException(`Vote with ID ${id} not found`);
    }

    return vote;
  }
}
