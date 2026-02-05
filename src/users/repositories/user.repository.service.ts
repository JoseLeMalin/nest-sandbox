import { Injectable } from "@nestjs/common";
import { PostgresService } from "../../services/postgres/postgres.service";
import { User, NewUser, UserUpdate } from "../entities/user.entity";

/**
 * Repository for user database operations.
 * Follows Kysely best practices from the documentation.
 */
@Injectable()
export class UserRepositoryService {
  constructor(private readonly postgresService: PostgresService) {}

  /**
   * Find a user by ID.
   * Returns undefined if not found.
   */
  async findUserById(id: number): Promise<User | undefined> {
    return await this.postgresService.db
      .selectFrom("user")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirst();
  }

  /**
   * Find all users matching the criteria.
   * Demonstrates conditional where clauses from Kysely docs.
   */
  async findUsers(criteria: Partial<User>): Promise<User[]> {
    let query = this.postgresService.db.selectFrom("user").selectAll();

    if (criteria.id) {
      query = query.where("id", "=", criteria.id);
    }

    if (criteria.first_name) {
      query = query.where("first_name", "=", criteria.first_name);
    }

    if (criteria.last_name !== undefined) {
      query = query.where(
        "last_name",
        criteria.last_name === null ? "is" : "=",
        criteria.last_name,
      );
    }

    if (criteria.gender) {
      query = query.where("gender", "=", criteria.gender);
    }

    return await query.execute();
  }

  /**
   * Create a new user.
   * Uses Kysely's returning clause (PostgreSQL feature).
   */
  async createUser(newUser: NewUser): Promise<User> {
    return await this.postgresService.db
      .insertInto("user")
      .values(newUser)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  /**
   * Update a user by ID.
   * Returns the updated user or undefined if not found.
   */
  async updateUser(
    id: number,
    updateWith: UserUpdate,
  ): Promise<User | undefined> {
    return await this.postgresService.db
      .updateTable("user")
      .set(updateWith)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  /**
   * Delete a user by ID.
   * Returns the deleted user or undefined if not found.
   */
  async deleteUser(id: number): Promise<User | undefined> {
    return await this.postgresService.db
      .deleteFrom("user")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  /**
   * Count users matching criteria.
   * Demonstrates aggregate functions from Kysely docs.
   */
  async countUsers(criteria?: Partial<User>): Promise<number> {
    let query = this.postgresService.db
      .selectFrom("user")
      .select(({ fn }) => [fn.count<number>("id").as("count")]);

    if (criteria?.gender) {
      query = query.where("gender", "=", criteria.gender);
    }

    const result = await query.executeTakeFirstOrThrow();
    return Number(result.count);
  }
}

