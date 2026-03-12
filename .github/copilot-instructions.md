# GitHub Copilot Instructions

## Build & Test

```bash
pnpm install
docker compose up -d          # starts PostgreSQL on port 5440
pnpm start:dev                # NestJS watch mode on port 3000
pnpm test                     # unit tests (Jest, *.spec.ts in src/)
pnpm test:e2e                 # e2e tests (test/jest-e2e.json)
```

## Architecture

- **GlobalDatabaseModule** (defined inline in `src/app.module.ts`) provides `PostgresService` everywhere — never re-import it.
- **`PostgresService.db`** exposes the `Kysely<DatabaseTables>` singleton; inject `PostgresService` and use `this.postgresService.db` directly.
- **`DatabaseTables`** (`src/infrastructure/database/entities/database.tables.ts`) is the single source of truth; add every new table here.
- **Two-layer architecture for features**: a `XxxRepositoryService` for raw CRUD + a `XxxService` for business logic (see `src/users/`). `VotesModule` deviates — migrate new features to the two-layer pattern.
- **JWT** is registered globally in `AuthModule`; any service can inject `JwtService` without re-importing `JwtModule`.

## Kysely Conventions

All table interfaces extend `CommonEntity` (`src/infrastructure/database/entities/common.entity.ts`) and export three utility types:
```typescript
export type Foo    = Selectable<FooTable>;   // reads
export type NewFoo = Insertable<FooTable>;   // inserts (id/timestamps auto-generated)
export type FooUpdate = Updateable<FooTable>; // updates
```

Standard query idioms used throughout the codebase:
```typescript
// Immutable conditional query building
let q = db.selectFrom("user").selectAll();
if (filter) q = q.where("gender", "=", filter);

// Mutations always use RETURNING
db.insertInto("user").values(newUser).returningAll().executeTakeFirstOrThrow();

// Transactions
db.transaction().execute(async trx => { ... });

// CTEs
db.with("scores", db => db.selectFrom("vote")...).selectFrom("scores").selectAll();
```

Reusable SQL helpers live in `src/configuration/database/kysely-helpers.ts` (`upper`, `lower`, `concat`, `fullTextSearch`, `generateUuid`, etc.).

## Adding a New Feature Module

1. Create `src/xxx/entities/xxx.entity.ts` — extend `CommonEntity`, export `Selectable`/`Insertable`/`Updateable` types.
2. Register the table in `DatabaseTables`.
3. Add a `XxxRepositoryService` (inject `PostgresService` only).
4. Add a `XxxService` (inject `PostgresService` + `XxxRepositoryService`).
5. Wire both into `XxxModule` providers.

## DTOs

- Extend `UpdateXxxDto` with `PartialType(CreateXxxDto)` from `@nestjs/swagger` (not `@nestjs/mapped-types`).
- No `class-validator` decorators currently — do not add them unless explicitly requested.
- Vote DTOs use snake_case matching DB columns; user DTOs use camelCase and map in the service layer.

## Environment

Variables are read via raw `process.env` in `datasource.ts`. The typed `env` object (`src/lib/env.validation.ts`, `@t3-oss/env-core` + Zod) is not yet wired up — use `process.env` for now, following existing patterns.

## Testing

Tests use `@nestjs/testing` `TestingModule`. Mock all injected services with `{ provide: XxxService, useValue: mockXxx }` — never instantiate real DB connections in unit tests. See `src/users/users.service.spec.ts` for the module setup pattern.
