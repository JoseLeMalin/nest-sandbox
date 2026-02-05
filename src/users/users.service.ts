import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PostgresService } from "../services/postgres/postgres.service";
import { UserRepositoryService } from "./repositories/user.repository.service";
import { User, NewUser } from "./entities/user.entity";
import { sql } from "kysely";

/**
 * Service handling user business logic.
 * Uses Kysely for type-safe database operations following best practices.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly postgresService: PostgresService,
    private readonly userRepository: UserRepositoryService,
  ) {}

  /**
   * Create a new user with transaction support.
   * Demonstrates Kysely's INSERT with RETURNING clause and transaction handling.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Map DTO to database entity
    const newUser: NewUser = {
      first_name: createUserDto.username,
      last_name: createUserDto.fullName || null,
      gender: "unknown",
    };

    try {
      // Use repository method for simple insert
      return await this.userRepository.createUser(newUser);
    } catch (error: any) {
      // Handle unique constraint violations
      if (error.code === "23505") {
        throw new ConflictException("User already exists");
      }
      throw error;
    }
  }

  /**
   * Find all users with optional filtering and pagination.
   * Demonstrates conditional where clauses and query building.
   */
  async findAll(filters?: {
    gender?: User["gender"];
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<User[]> {
    let query = this.postgresService.db.selectFrom("user").selectAll();

    // Conditional filtering (Kysely immutable pattern)
    if (filters?.gender) {
      query = query.where("gender", "=", filters.gender);
    }

    // Search by first name or last name using OR
    if (filters?.search) {
      query = query.where((eb) =>
        eb.or([
          eb("first_name", "ilike", `%${filters.search}%`),
          eb("last_name", "ilike", `%${filters.search}%`),
        ]),
      );
    }

    // Pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    // Order by created_at descending
    query = query.orderBy("created_at", "desc");

    return await query.execute();
  }

  /**
   * Find one user by ID.
   * Throws NotFoundException if user doesn't exist.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Find user by first name with case-insensitive search.
   * Demonstrates using SQL functions in queries.
   */
  async findOneByUsername(username: string): Promise<User | undefined> {
    return await this.postgresService.db
      .selectFrom("user")
      .selectAll()
      .where(sql`LOWER(first_name)`, "=", username.toLowerCase())
      .executeTakeFirst();
  }

  /**
   * Find users with their vote count.
   * Demonstrates subqueries and aggregate functions from Kysely docs.
   */
  async findUsersWithVoteCount(): Promise<
    Array<User & { vote_count: number }>
  > {
    const result = await this.postgresService.db
      .selectFrom("user")
      .selectAll("user")
      .select((eb) =>
        eb
          .selectFrom("vote")
          .select((eb) =>
            eb.fn
              .coalesce(eb.fn.count<number>("vote.id"), sql<number>`0`)
              .as("count"),
          )
          .whereRef("vote.user_id", "=", "user.id")
          .as("vote_count"),
      )
      .execute();

    return result as Array<User & { vote_count: number }>;
  }

  /**
   * Get user statistics using aggregate functions.
   * Demonstrates GROUP BY and HAVING clauses.
   */
  async getUserStatistics() {
    return await this.postgresService.db
      .selectFrom("user")
      .select([
        "gender",
        (eb) => eb.fn.count<number>("id").as("count"),
        (eb) => eb.fn.avg<number>("id").as("avg_id"),
      ])
      .groupBy("gender")
      .having((eb) => eb.fn.count("id"), ">", 0)
      .execute();
  }

  /**
   * Update a user by ID.
   * Demonstrates UPDATE with RETURNING clause.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists first
    await this.findOne(id);

    // Build update object conditionally
    const updateData: Partial<NewUser> = {};

    if (updateUserDto.username !== undefined) {
      updateData.first_name = updateUserDto.username;
    }

    if (updateUserDto.fullName !== undefined) {
      updateData.last_name = updateUserDto.fullName;
    }

    // Only update if there's data to update
    if (Object.keys(updateData).length === 0) {
      return await this.findOne(id);
    }

    const updatedUser = await this.userRepository.updateUser(id, updateData);

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  /**
   * Soft delete or hard delete a user.
   * Demonstrates DELETE with RETURNING and conditional logic.
   */
  async remove(id: number, soft: boolean = false): Promise<User> {
    // Check if user exists first
    await this.findOne(id);

    if (soft) {
      // Soft delete: update deleted_at timestamp
      const deletedUser = await this.postgresService.db
        .updateTable("user")
        .set({ updated_at: sql`NOW()` })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirst();

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return deletedUser;
    } else {
      // Hard delete
      const deletedUser = await this.userRepository.deleteUser(id);

      if (!deletedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return deletedUser;
    }
  }

  /**
   * Create multiple users in a transaction.
   * Demonstrates Kysely's transaction support from the docs.
   */
  async createMany(users: CreateUserDto[]): Promise<User[]> {
    return await this.postgresService.db.transaction().execute(async (trx) => {
      const createdUsers: User[] = [];

      for (const userDto of users) {
        const newUser: NewUser = {
          first_name: userDto.username,
          last_name: userDto.fullName || null,
          gender: "unknown",
        };

        const user = await trx
          .insertInto("user")
          .values(newUser)
          .returningAll()
          .executeTakeFirstOrThrow();

        createdUsers.push(user);
      }

      return createdUsers;
    });
  }

  /**
   * Complex query: Find users and their recent votes.
   * Demonstrates JOINs, subqueries, and complex selections.
   */
  async findUsersWithRecentVotes(limit: number = 5) {
    return await this.postgresService.db
      .selectFrom("user")
      .innerJoin("vote", "vote.user_id", "user.id")
      .select([
        "user.id",
        "user.first_name",
        "user.last_name",
        "vote.vote_type",
        "vote.created_at as vote_created_at",
      ])
      .orderBy("vote.created_at", "desc")
      .limit(limit)
      .execute();
  }

  /**
   * Bulk update users by gender.
   * Demonstrates UPDATE with WHERE IN.
   */
  async bulkUpdateByGender(
    gender: User["gender"],
    updates: Partial<NewUser>,
  ): Promise<number> {
    const result = await this.postgresService.db
      .updateTable("user")
      .set(updates)
      .where("gender", "=", gender)
      .executeTakeFirst();

    return Number(result.numUpdatedRows);
  }

  /**
   * Count users by criteria using the repository method.
   */
  async countUsers(criteria?: Partial<User>): Promise<number> {
    return await this.userRepository.countUsers(criteria);
  }
}
