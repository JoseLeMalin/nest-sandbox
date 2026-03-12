# CLAUDE.md — Project Context

This file provides context about the `nest-sandbox` project for AI assistants. Update it as the project evolves.

---

## Project Overview

A NestJS sandbox/learning project demonstrating REST API patterns with PostgreSQL, Kysely ORM, and JWT authentication.
The project aims to deliver an voting application where users are given questions and their choices are saved in database. 

- **Framework**: NestJS v11
- **Language**: TypeScript
- **Database**: PostgreSQL (via Kysely query builder)
- **Auth**: JWT (`@nestjs/jwt`)
- **Package manager**: pnpm
- **Runtime**: Node.js >= 20

---

## Architecture

### Modules

| Module | Responsibility |
|--------|---------------|
| `AppModule` | Root module; registers a global `DatabaseModule` that provides `PostgresService` |
| `AuthModule` | JWT-based sign-in; issues access tokens |
| `UsersModule` | CRUD for users; includes a dedicated `UserRepositoryService` |
| `VotesModule` | CRUD for votes |

### Key Design Decisions

- **`PostgresService`** is registered as a `@Global()` provider so it can be injected anywhere without re-importing a module.
- **Kysely** is used as a type-safe query builder (not an ORM). A singleton instance is created in `src/configuration/database/datasource.ts`.
- **`DatabaseTables`** (`src/infrastructure/database/entities/database.tables.ts`) is the central interface that maps table names to their TypeScript schema types.
- Repository classes (e.g., `UserRepositoryService`) encapsulate raw Kysely queries and are injected into service classes that contain business logic.

---

## Directory Structure

```
src/
├── app.module.ts                   # Root module
├── auth/                           # JWT authentication
├── configuration/
│   ├── database/
│   │   ├── datasource.ts           # Kysely singleton factory
│   │   ├── kysely-helpers.ts       # Shared Kysely utilities
│   │   ├── schemas/                # Zod/column schemas
│   │   └── tables/                 # Per-table Kysely column configs
│   └── secrets/                    # Environment/secret constants
├── infrastructure/
│   └── database/
│       └── entities/
│           ├── common.entity.ts    # Shared column types (id, timestamps…)
│           └── database.tables.ts  # Central DatabaseTables interface
├── lib/
│   └── env.validation.ts           # @t3-oss/env-core environment validation
├── services/
│   └── postgres/
│       └── postgres.service.ts     # NestJS wrapper around Kysely instance
├── users/                          # Users feature module
│   ├── dto/
│   ├── entities/
│   └── repositories/
└── votes/                          # Votes feature module
    ├── dto/
    └── entities/
```

---

## Database

- **PostgreSQL** running via Docker (see `docker-compose.yaml`).
- Local port: `5440` (mapped to container port `5432`).
- Environment variables: `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRESDB_LOCAL_PORT`.
- DB init scripts live in `init-db/`.

## Testing

- **Unit tests**: Jest, co-located with source files (`*.spec.ts`).
- **E2E tests**: `test/app.e2e-spec.ts` using `jest-e2e.json` config.
- **Mocking**: `@nestjs/testing` `TestingModule` with manual mocks for services/repositories.

## Linting and formatting

Linting and formatting tasks are not part of your responsabilities scope. You never ask for linting nor formatting the codebase. This will be done by deterministic tools.


## Documentation

Additional documentation lives in the `documentation/` folder:

- [DOCKER.md](../documentation/DOCKER.md) — Docker setup details
- [KYSELY.md](../documentation/KYSELY.md) — Kysely usage patterns and conventions

See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
See @README for project overview and @package.json for available npm commands for this project.