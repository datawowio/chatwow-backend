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
    .addColumn('ai_model_name', 'text', (col) => col.notNull())
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

  await db.schema
    .alterTable('ai_models')
    .alterColumn('ai_model_name', (col) => col.setDataType('text'))
    .execute();

  await db.deleteFrom('ai_models').execute();
  await db.schema
    .alterTable('ai_models')
    .addColumn('config', 'jsonb', (col) => col.notNull())
    .addColumn('provider', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .alterTable('ai_models')
    .dropColumn('price_per_token')
    .execute();

  await sql`
    ALTER TABLE ai_models 
    ALTER COLUMN ai_model_name TYPE text 
    USING ai_model_name::text
  `.execute(db);

  await db.schema.dropType('ai_model_name').execute();

  await db
    .insertInto('ai_models')
    .values([
      {
        ai_model_name: 'gpt-4o-mini',
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`,
        config: {
          inputRatePerMil: 0.15,
          cachedInputRatePerMil: 0.075,
          outputRatePerMil: 0.6,
        },
        provider: 'openai',
      },
      {
        ai_model_name: 'gpt-4.1',
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`,
        config: {
          inputRatePerMil: 2.0,
          cachedInputRatePerMil: 0.5,
          outputRatePerMil: 8.0,
        },
        provider: 'openai',
      },
      {
        ai_model_name: 'gpt-4.1-mini',
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`,
        config: {
          inputRatePerMil: 2.0,
          cachedInputRatePerMil: 0.5,
          outputRatePerMil: 8.0,
        },
        provider: 'openai',
      },
      {
        ai_model_name: 'claude-haiku-4-5',
        created_at: sql`CURRENT_TIMESTAMP`,
        updated_at: sql`CURRENT_TIMESTAMP`,
        config: {
          inputRatePerMil: 1.0,
          outputRatePerMil: 5.0,
          cachedWriteRatePerMil: 1.25,
          cachedReadRatePerMil: 0.1,
        },
        provider: 'claude',
      },
    ])
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  // Delete the inserted ai_models data
  await db.deleteFrom('ai_models').execute();

  // Recreate ai_model_name enum
  await db.schema.createType('ai_model_name').asEnum(['GPT_DW']).execute();

  // Restore ai_models columns and convert ai_model_name back to enum
  await db.schema
    .alterTable('ai_models')
    .addColumn('price_per_token', 'decimal(20, 10)', (col) => col.notNull())
    .execute();

  await db.schema
    .alterTable('ai_models')
    .dropColumn('config')
    .dropColumn('provider')
    .execute();

  await sql`
    ALTER TABLE ai_models 
    ALTER COLUMN ai_model_name TYPE ai_model_name 
    USING ai_model_name::ai_model_name
  `.execute(db);

  // Restore ai_usages columns
  await db.schema
    .alterTable('ai_usages')
    .addColumn('ai_model_name', sql`ai_model_name`, (col) => col.notNull())
    .addColumn('token_used', 'double precision', (col) => col.notNull())
    .addColumn('token_price', 'decimal(20, 10)', (col) => col.notNull())
    .addColumn('token_info', 'jsonb', (col) => col.notNull())
    .execute();

  // Drop users.department_id column
  await db.schema.alterTable('users').dropColumn('department_id').execute();

  // Drop ai_usage_tokens table
  await db.schema.dropTable('ai_usage_tokens').execute();

  // Drop departments table
  await db.schema.dropTable('departments').execute();

  // Recreate ai_usage_user_groups table
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

  // Recreate indexes
  await db.schema
    .createIndex('ai_usage_user_groups_ai_usage_id_idx')
    .on('ai_usage_user_groups')
    .column('ai_usage_id')
    .execute();

  await db.schema
    .createIndex('ai_usage_user_groups_user_group_id_idx')
    .on('ai_usage_user_groups')
    .column('user_group_id')
    .execute();
}
