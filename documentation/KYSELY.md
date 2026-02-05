# Kysely Database Setup

This project uses [Kysely](https://kysely.dev) - a type-safe SQL query builder for TypeScript.

## Architecture Overview

### Key Components

1. **Database Schema** (`src/infrastructure/database/entities/`)
   - Type definitions for all database tables
   - Uses Kysely's type helpers: `Generated`, `ColumnType`, `Selectable`, `Insertable`, `Updateable`

2. **Database Service** (`src/services/postgres/`)
   - Singleton Kysely instance management
   - Automatic connection cleanup on application shutdown
   - Global module for dependency injection

3. **Repositories** (`src/*/repositories/`)
   - Type-safe database operations
   - Following repository pattern for data access

## Design Decisions (Based on Kysely Documentation)

### 1. Singleton Pattern
Per Kysely docs: *"In most cases, you should only create a single Kysely instance per database."*

✅ Implementation: `getKyselyInstance()` in `datasource.ts` ensures one instance across the app.

### 2. Type Safety with Helper Types

```typescript
// Table definition
export interface UserTable extends CommonEntity {
  first_name: string;
  last_name: string | null;
  gender: "man" | "woman" | "other" | "unknown";
}

// Operation-specific types
export type User = Selectable<UserTable>;      // For SELECT queries
export type NewUser = Insertable<UserTable>;   // For INSERT queries
export type UserUpdate = Updateable<UserTable>; // For UPDATE queries
```

### 3. Column Type Specifications

```typescript
// Auto-generated columns
id: Generated<number>

// Different types for select/insert/update
created_at: ColumnType<Date, string | Date | undefined, string | Date>
```

### 4. Immutable Query Builder

```typescript
// ❌ Wrong - mutation doesn't work
let query = db.selectFrom('user').selectAll();
if (condition) {
  query.where('id', '=', 1); // This does nothing!
}

// ✅ Correct - reassign the result
let query = db.selectFrom('user').selectAll();
if (condition) {
  query = query.where('id', '=', 1); // Reassign!
}
```

### 5. Global Database Module

The `DatabaseModule` is marked as `@Global()` so PostgresService can be injected anywhere without importing the module in every feature module.

## Usage Examples

### Basic CRUD Operations

```typescript
@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepositoryService) {}

  async getUser(id: number) {
    return await this.userRepo.findUserById(id);
  }

  async createUser(data: NewUser) {
    return await this.userRepo.createUser(data);
  }

  async updateUser(id: number, data: UserUpdate) {
    return await this.userRepo.updateUser(id, data);
  }
}
```

### Complex Queries

```typescript
// Join example
const result = await this.postgresService.db
  .selectFrom('user')
  .innerJoin('vote', 'vote.user_id', 'user.id')
  .select(['user.first_name', 'vote.vote_type'])
  .where('user.id', '=', userId)
  .execute();

// Subquery example
const result = await this.postgresService.db
  .selectFrom('user')
  .select((eb) => [
    'user.id',
    eb
      .selectFrom('vote')
      .select((eb) => eb.fn.count<number>('id').as('count'))
      .whereRef('vote.user_id', '=', 'user.id')
      .as('vote_count'),
  ])
  .execute();

// Transaction example
await this.postgresService.db.transaction().execute(async (trx) => {
  const user = await trx
    .insertInto('user')
    .values({ first_name: 'John', last_name: 'Doe', gender: 'man' })
    .returningAll()
    .executeTakeFirstOrThrow();

  await trx
    .insertInto('vote')
    .values({ user_id: user.id, vote_type: 'upvote', target_id: 1, target_type: 'post' })
    .execute();

  return user;
});
```

### Using Helper Functions

```typescript
import { upper, concat } from '@/configuration/database/kysely-helpers';

// Use helpers in queries
const result = await this.postgresService.db
  .selectFrom('user')
  .select(({ ref }) => [
    'id',
    upper(ref('first_name')).as('first_name_upper'),
    concat(ref('first_name'), sql` `, ref('last_name')).as('full_name'),
  ])
  .execute();
```

## Best Practices

### 1. Never Use Table Interfaces Directly
```typescript
// ❌ Don't use UserTable in your code
function createUser(user: UserTable) { }

// ✅ Use the type helpers instead
function createUser(user: NewUser) { }
```

### 2. Handle Nullable Columns Correctly
```typescript
// ❌ Don't use optional properties
interface UserTable {
  last_name?: string; // Wrong!
}

// ✅ Use nullable types
interface UserTable {
  last_name: string | null; // Correct!
}
```

### 3. Use Column Names, Not Aliases in Where Clauses
```typescript
// ❌ Wrong
const result = await db
  .selectFrom('user')
  .select('first_name as firstName')
  .where('firstName', '=', 'John'); // Error!

// ✅ Correct
const result = await db
  .selectFrom('user')
  .select('first_name as firstName')
  .where('first_name', '=', 'John'); // Use actual column name
```

### 4. Type Raw SQL Queries
```typescript
import { sql } from 'kysely';

// Always provide the return type
const result = await sql<User>`
  SELECT * FROM "user" WHERE id = ${userId}
`.execute(db);
```

## Logging

Logging is enabled in development mode (see `datasource.ts`). Each query logs:
- SQL statement
- Execution duration
- Errors (if any)

To disable logging, remove the `log` property from the Kysely constructor.

## Migrations

Kysely supports migrations. To set up:

```bash
# Install kysely-ctl
npm install --save-dev kysely-ctl

# Create a migration
npx kysely-ctl migrate:make migration_name

# Run migrations
npx kysely-ctl migrate:latest
```

## Type Generation

For production apps, consider using [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen) to automatically generate types from your database schema:

```bash
npm install --save-dev kysely-codegen

# Generate types
npx kysely-codegen --out-file=src/infrastructure/database/entities/generated-types.ts
```

## Resources

- [Kysely Documentation](https://kysely.dev)
- [API Reference](https://kysely-org.github.io/kysely-apidoc/)
- [Examples](https://kysely.dev/docs/category/examples)
- [Discord Community](https://discord.gg/xyBJ3GwvAm)
