import { type Kysely, sql } from 'kysely';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('ai_usage_user_groups').execute();

  await db.schema
    .createTable('departments')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('department_name', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('ai_usage_tokens')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('ai_model_name', sql`ai_model_name`, (col) => col.notNull())
    .addColumn('total_price', 'decimal(20, 10)', (col) => col.notNull())
    .addColumn('initial_total_price', 'decimal(20, 10)', (col) => col.notNull())
    .addColumn('input_tokens', 'int4', (col) => col.notNull().defaultTo(0))
    .addColumn('output_tokens', 'int4', (col) => col.notNull().defaultTo(0))
    .addColumn('total_tokens', 'int4', (col) => col.notNull().defaultTo(0))
    .addColumn('cache_creation_input_tokens', 'int4', (col) =>
      col.notNull().defaultTo(0),
    )
    .addColumn('cache_read_input_tokens', 'int4', (col) =>
      col.notNull().defaultTo(0),
    )
    .addColumn('ai_usage_id', 'uuid', (col) =>
      col.references('ai_usages.id').notNull(),
    )
    .execute();

  await db.schema
    .alterTable('users')
    .addColumn('department_id', 'uuid', (col) =>
      col.references('departments.id'),
    )
    .execute();

  await db.schema
    //
    .alterTable('ai_usages')
    .dropColumn('ai_model_name')
    .dropColumn('token_used')
    .dropColumn('token_info')
    .dropColumn('token_price')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('ai_usages')
    .addColumn('ai_model_name', sql`ai_model_name`, (col) => col.notNull())
    .addColumn('token_used', 'double precision', (col) => col.notNull())
    .addColumn('token_price', 'decimal(20, 10)', (col) => col.notNull())
    .addColumn('token_info', 'jsonb', (col) => col.notNull())
    .execute();

  await db.schema.alterTable('users').dropColumn('department_id').execute();

  await db.schema.dropTable('departments').execute();

  await db.schema
    .createTable('ai_usage_user_groups')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('user_group_id', 'uuid', (col) => col)
    .addColumn('token_price', 'decimal(20, 10)', (col) => col.notNull())
    .addColumn('token_used', 'double precision', (col) => col.notNull())
    .addColumn('chat_count', 'double precision', (col) => col.notNull())
    .addColumn('ai_usage_id', 'uuid', (col) =>
      col.references('ai_usages.id').onDelete('cascade').notNull(),
    )
    .execute();
}
