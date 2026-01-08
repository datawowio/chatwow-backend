import { type Kysely, sql } from 'kysely';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    //
    .createType('ai_model_name')
    .asEnum(['GPT_DW'])
    .execute();

  await db.schema
    .createType('ai_usage_action')
    .asEnum([
      'CHAT_LINE',
      'CHAT_PROJECT',
      'GENERATE_PROJECT_SUMMARY',
      'GENERATE_PROJECT_DOCUMENT_SUMMARY',
    ])
    .execute();

  //
  // AI USAGES
  //
  await db.schema
    .createTable('ai_usages')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('created_by_id', 'uuid', (col) => col)
    .addColumn('ai_model_name', sql`ai_model_name`, (col) => col.notNull())
    .addColumn('ai_usage_action', sql`ai_usage_action`, (col) => col.notNull())
    .addColumn('project_id', 'uuid', (col) => col.notNull())
    .addColumn('ai_request_at', 'timestamptz', (col) => col.notNull())
    .addColumn('ai_reply_at', 'timestamptz')
    .addColumn('reply_time_ms', 'int4')
    .addColumn('token_used', 'decimal(10, 2)', (col) => col.notNull())
    .addColumn('token_price', 'decimal(10, 2)', (col) => col.notNull())
    .addColumn('token_info', 'jsonb', (col) => col.notNull())
    .addColumn('confidence', 'int2', (col) => col.notNull())
    .addColumn('ref_table', 'text', (col) => col.notNull())
    .addColumn('ref_id', 'uuid', (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex('ai_usages_project_id_idx')
    .on('ai_usages')
    .column('project_id')
    .execute();

  //
  // AI USAGE USER GROUPS
  //
  await db.schema
    .createTable('ai_usage_user_groups')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('user_group_id', 'uuid', (col) => col)
    .addColumn('token_used', 'decimal(10, 2)', (col) => col.notNull())
    .addColumn('token_price', 'decimal(10, 2)', (col) => col.notNull())
    .addColumn('chat_count', 'decimal(10, 2)', (col) => col.notNull())
    .addColumn('ai_usage_id', 'uuid', (col) =>
      col.references('ai_usages.id').onDelete('cascade').notNull(),
    )
    .execute();

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

  //
  // AI MODELS
  //
  await db.schema
    .createTable('ai_models')
    .addColumn('ai_model_name', sql`ai_model_name`, (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('price_per_token', 'decimal(10, 2)', (col) => col.notNull())
    .execute();

  await db
    .insertInto('ai_models')
    .values({
      ai_model_name: 'GPT_DW',
      created_at: myDayjs().toISOString(),
      updated_at: myDayjs().toISOString(),
      price_per_token: '10.00',
    })
    .execute();

  //
  // APP CONFIGURATIONS
  //
  await db.schema
    .createTable('app_configurations')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('config_key', 'text', (col) => col.notNull().unique())
    .addColumn('config_data', 'jsonb', (col) => col.notNull())
    .execute();

  await db
    .insertInto('app_configurations')
    .values({
      id: uuidV7(),
      created_at: myDayjs().toISOString(),
      updated_at: myDayjs().toISOString(),
      config_key: 'AI',
      config_data: {
        model: 'GPT_DW',
        apiKey: null,
      },
    })
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('app_configurations').ifExists().execute();
  await db.schema.dropTable('ai_models').ifExists().execute();
  await db.schema
    .dropIndex('ai_usage_user_groups_user_group_id_idx')
    .ifExists()
    .execute();
  await db.schema
    .dropIndex('ai_usage_user_groups_ai_usage_id_idx')
    .ifExists()
    .execute();
  await db.schema.dropTable('ai_usage_user_groups').ifExists().execute();
  await db.schema.dropIndex('ai_usages_project_id_idx').ifExists().execute();
  await db.schema.dropTable('ai_usages').ifExists().execute();
  await db.schema.dropType('ai_usage_action').ifExists().execute();
  await db.schema.dropType('ai_model').ifExists().execute();
}
