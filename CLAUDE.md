# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Project Setup
```bash
# First time setup (creates .env, starts docker, installs deps, runs migrations and seeds)
npm run cmd initproject

# Start development (runs both API and worker concurrently)
npm run dev

# Start API only
npm run dev:app

# Start worker only
npm run dev:worker
```

### Database Management
```bash
# Create new migration file (you must write migration manually using Kysely)
npm run cmd db:make <migration-name>

# Run pending migrations and regenerate types
npm run cmd db:up

# Rollback last migration
npm run cmd db:prev

# Reset database (drop, migrate, seed)
npm run cmd db:init

# Generate TypeScript types from database schema
npm run cmd db:type
```

### Testing
```bash
# Run all e2e tests (uses testcontainers)
npm run test

# Run unit tests
npm run test:unit

# E2E tests only
npm run test:e2e
```

**Important:** All tests run inside transactions. Every e2e test must use `startTestApp(module)` at the beginning and `endTestApp(app)` in `afterAll()`. Tests are based on seed data defined in [src/app/cli/initials/](src/app/cli/initials/).

### Linting and Formatting
```bash
# Lint and auto-fix
npm run lint

# Format code
npm run format
```

### CLI Commands
```bash
# Run custom CLI commands
npm run cli <command-name>

# Example: run initial seed
npm run cli initials:seed
```

### Other Utilities
```bash
# Develop react email templates
npm run dev:email

# Start REPL
npm run repl
```

## Architecture Overview

### Dual Entry Point System
This NestJS application runs as **two separate entry points**:
- **API (main.ts)**: REST API server on port 3000 (default)
- **Worker (worker.ts)**: Background task processor using BullMQ

Both share the same domain logic but use different modules (`AppApiModule` vs `AppWorkerModule`).

### Directory Structure

```
src/
├── app/              # Application layer (controllers, commands, queries, workers)
│   ├── api/          # API controllers organized by version (v1, root)
│   ├── worker/       # Background job handlers (domain-event, line-event, cron)
│   └── cli/          # CLI commands (nest-commander)
├── domain/           # Business logic layer
│   ├── base/         # Core domain entities and services (user, project, session, etc.)
│   ├── logic/        # Higher-level business logic (ai-api, auth, pg)
│   └── queue/        # Queue definitions (domain-event, line-event)
├── infra/            # Infrastructure layer
│   ├── db/           # Database setup (Kysely ORM, migrations, transaction management)
│   ├── middleware/   # Auth, guards, interceptors
│   ├── i18n/         # Internationalization (typesafe-i18n)
│   └── global/       # Global utilities (email templates, file storage)
└── shared/           # Shared utilities
    ├── common/       # Common utilities (crypto, dayjs, validators, etc.)
    ├── http/         # HTTP utilities (exceptions, response mappers)
    ├── task/         # Task/queue base classes and decorators
    └── zod/          # Zod validation schemas
```

### Path Aliases
```typescript
@app/*     → src/app/*
@domain/*  → src/domain/*
@infra/*   → src/infra/*
@shared/*  → src/shared/*
```

### Database Architecture

**ORM:** Kysely (type-safe query builder, NO Prisma)

**Key Components:**
- **MainDb** ([src/infra/db/db.main.ts](src/infra/db/db.main.ts)): Provides `.read` and `.write` properties that automatically use transaction context when available
- **TransactionService**: Manages database transactions using async local storage
- **Read Replicas**: Configured in [db.provider.ts](src/infra/db/db.provider.ts) (currently points to main DB, change `READ_DB` provider to enable replicas)

**Migration workflow:**
1. Run `npm run cmd db:make <name>` to create migration file
2. Manually write `up()` and `down()` functions using Kysely schema builder (see [src/infra/db/migrations/1733631587038_init.ts](src/infra/db/migrations/1733631587038_init.ts) for reference)
3. Run `npm run cmd db:up` to apply migration and auto-regenerate TypeScript types
4. Auto-generated DBML schema is created in [schema.dbml](schema.dbml)

**Migration Example:**
```typescript
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
```

**Transaction Management:**
- Wrap all write/read chains in transactions using `TransactionService.transaction(callback)`
- All operations inside the callback (even reads) use the main DB
- Always `await` methods inside transactions or they will release early
- The `MainDb.read` and `MainDb.write` getters automatically detect and use active transactions

### Domain Layer Pattern (`src/domain/base/*`)

**Every database table has its own domain** following a consistent file structure:
- `<entity>.domain.ts` - Domain entity class
- `<entity>.service.ts` - CRUD operations (findOne, findMany, save, delete)
- `<entity>.mapper.ts` - Transformations between layers (fromPg, toPg, toResponse, toJson)
- `<entity>.factory.ts` - Factory functions for creating new instances
- `<entity>.type.ts` - Type definitions (UserPg, UserPlain, UserJson)
- `<entity>.zod.ts` - Zod schemas for validation
- `<entity>.response.ts` - API response types
- `<entity>.util.ts` - Helper functions (filters, utilities)
- `<entity>.constant.ts` - Constants

**Domain Entities** extend `DomainEntity<T>` which tracks persistence state:
- `isPersist`: Whether entity has been saved to database
- `pgState`: Snapshot of database state for change detection
- `setPgState()`: Update the tracked state

**Example Domain Entity:**
```typescript
export class User extends DomainEntity<UserPg> {
  readonly id: string;
  readonly email: string;
  // ... other properties

  edit({ actorId, data }: UserUpdateData) {
    // Pure function pattern: creates new state
    const plain: UserPlain = {
      id: this.id,
      email: isDefined(data.email) ? data.email : this.email,
      // ... update logic
    };
    Object.assign(this, plain);
  }
}
```

**Mapper Functions** (critical for domain transformations):
- `fromPg(pg)` - Convert database row to domain entity
- `fromPgWithState(pg)` - Convert and set persistence state
- `toPg(domain)` - Convert domain entity to database row
- `toResponse(domain)` - Convert domain to API response format
- `toJson(domain)` / `fromJson(json)` - For queue serialization
- `toJsonState(domain)` / `fromJsonState(json)` - Include pgState for queue jobs

**Service Layer:**
- `findOne(id)`, `findMany(ids)`, `getIds(opts)`: Read operations
- `save(entity)`: Upsert based on `isPersist` flag (calls `_create()` or `_update()`)
- `delete(id)`: Soft or hard delete
- Services in `domain/base/` handle single entities
- Services in `domain/logic/` handle cross-entity business logic

### Error Handling Pattern

**Key Principle:** Throw `ApiException` directly with error keys for frontend communication.

**Pattern:**
1. Command/Query handlers throw `ApiException(httpStatus, errorKey)` when validation or business rules fail
2. Frontend receives the error key for UI logic
3. No `neverthrow` Result types - use direct exception throwing

**Example:**
```typescript
// In command handler
async exec(claims: UserClaims, body: AddUserDto): Promise<AddUserResponse> {
  const user = newUser({ actorId: claims.userId, data: body.user });

  const userGroups = await this.getUserGroups(body.userGroupIds);
  const manageProjects = await this.getProjects(body.manageProjectIds);

  await this.save({ user, userGroups, manageProjects });

  return toHttpSuccess({ data: { user: userToResponse(user) } });
}

async getUserGroups(ids?: string[]): Promise<UserGroup[]> {
  if (!ids?.length) return [];

  const groups = await this.db.read
    .selectFrom('user_groups')
    .selectAll()
    .where('id', 'in', ids)
    .execute();

  if (groups.length !== ids.length) {
    throw new ApiException(400, 'invalidGroupId');
  }

  return groups.map((g) => userGroupFromPgWithState(g));
}
```

**ApiException Constructor:**
```typescript
new ApiException(httpStatus: number, key: string, opts?: {
  info?: { fields?: Record<string, string[]>, context?: Record<string, string> },
  error?: unknown
})
```

### Queue & Worker System

**Queue Setup:**
1. Define queue names in [src/app/worker/worker.queue.ts](src/app/worker/worker.queue.ts)
2. Create queue class in `src/domain/queue/<name>/` extending `BaseQueue`
3. Create job handler in `src/app/worker/<name>/` extending `BaseTaskHandler`
4. Use `@Task()` decorator to register job handlers

**Example Queue Usage:**
```typescript
// In queue class
export class DomainEventQueue extends BaseQueue {
  queueName = QUEUE.DOMAIN_EVENT;

  jobSendVerification(user: User) {
    this.addJob(DOMAIN_EVENT_JOBS.SEND_VERIFICATION, userToJsonState(user));
  }
}

// In handler class
export class DomainEventHandler extends BaseTaskHandler {
  @Task(DOMAIN_EVENT_JOBS.SEND_VERIFICATION)
  async handleSendVerification(data: UserJsonState) {
    // Process job
  }
}
```

### API Design Principles

**Avoid UI-coupled APIs:**
- Design endpoints around business logic, not UI requirements
- Single endpoint should serve multiple UI use cases (tables, dropdowns, modals)
- Use query parameters for filtering/including relations
- Let frontend control data projection, not backend

**Example:** `GET /users?include=roles,profile` should serve table views, dropdowns, and detail views.

### Internationalization (i18n)

- Uses `typesafe-i18n` library
- Add translations in [src/infra/i18n](src/infra/i18n) language subfolders
- Run `npm run lang` to compile translations
- Usage: `import L from '@infra/i18n/i18n-node'; L.th.HI({ name: 'robert' })`
- **IMPORTANT:** Only use for reports/backend messages, NOT for frontend UI text

### Code Style Guidelines

**Private Members Naming:**
- Private methods and properties MUST start with underscore (enforced by ESLint)
- Example: `private _validateUser()`, `private _pgState`

**Pure Functions Encouraged:**
- Prefer functions that don't mutate external state
- Clone objects before modification
- Example: Domain entity `.edit()` methods create new state instead of mutating

**Type Definitions:**
- Prefer `type` over `interface` (enforced by ESLint)
- Use `@types` from `src/infra/db/db.ts` for database types

### Testing Guidelines

- **E2E tests only** (no unit tests unless specifically needed)
- All tests run in transactions via testcontainers
- Test structure:
  ```typescript
  let app: TestApp;

  beforeAll(async () => {
    app = await startTestApp(module);
  });

  afterAll(async () => {
    await endTestApp(app);
  });
  ```
- Tests use seed data from `src/app/cli/initials/`
- Ensure every endpoint has test coverage

### CI/CD Notes

**CI Pipeline (for DevOps):**
```bash
# Setup pipeline (after PR open)
./scripts/setup.sh merge

# Build pipeline (before build)
./scripts/setup.sh build
```

**CD Deployment:**
1. Run DB migrations: `docker run $image db:deploy`
2. Deploy API: `docker run $image start`
3. Deploy Worker: `docker run $image start:worker`

**Note:** There will be 2-3 minutes downtime during deployment when DB schema changes affect running app.

### Development Tools

- **Swagger UI:** http://localhost:3000/docs/swagger/
- **Bullboard (Queue UI):** http://localhost:2999
- **Node Version:** 22.18.0 (check `package.json` engines field)
- **Package Manager:** npm

### Important Files to Know

- [cmd.sh](cmd.sh): Project command runner (db management, docker control)
- [kysely.config.ts](kysely.config.ts): Kysely migration configuration
- [schema.dbml](schema.dbml): Auto-generated database schema (can publish to dbdocs.io)
- [src/infra/db/migrations/](src/infra/db/migrations/): Database migrations
- [src/shared/common/common.type.ts](src/shared/common/common.type.ts): Shared type definitions
- [src/shared/http/http.exception.ts](src/shared/http/http.exception.ts): HTTP exception classes

### Common Patterns

**Creating a new API endpoint:**
1. Create command/query handler in `src/app/api/v1/<resource>/<action>/`
   - `<action>.command.ts` or `<action>.query.ts`
   - `<action>.dto.ts` with Zod validation schemas
2. Add route to controller in `<resource>.v1.controller.ts`
3. Implement business logic using domain services and entities
4. Throw `ApiException` for validation/business rule failures
5. Return success using `toHttpSuccess({ data })`

**Creating a new domain entity (for a new table):**
1. Write migration in `src/infra/db/migrations/` using Kysely schema builder
2. Run `npm run cmd db:up` to generate TypeScript types
3. Create domain folder: `src/domain/base/<entity>/`
4. Create files following the pattern:
   - `<entity>.domain.ts` - Domain class extending `DomainEntity<EntityPg>`
   - `<entity>.mapper.ts` - All mapper functions (fromPg, toPg, toResponse, toJson, etc.)
   - `<entity>.service.ts` - CRUD service (findOne, findMany, save, delete)
   - `<entity>.factory.ts` - Factory function `newEntity(data)`
   - `<entity>.type.ts` - Type definitions (EntityPg, EntityPlain, EntityJson)
   - `<entity>.response.ts` - API response type
   - `<entity>.zod.ts` - Zod schemas for queries/filters
   - `<entity>.util.ts` - Helper functions (table filters)
   - `<entity>.module.ts` - NestJS module with service provider
5. Play with domain entities in API command/query handlers

**Adding a new background job:**
1. Define job name in `src/app/worker/worker.job.ts`
2. Create handler in `src/app/worker/<queue-name>/<job-name>/`
3. Add `@Task()` decorated method in handler class
4. Call from queue class method using `addJob()`
5. Use `toJsonState()` mapper when passing domain entities to jobs
