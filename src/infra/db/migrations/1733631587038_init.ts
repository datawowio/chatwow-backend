import { type Kysely, sql } from 'kysely';

import { config } from '@infra/config';

import { DEFAULT_LINEBOT_ID } from '@shared/common/common.constant';
import myDayjs from '@shared/common/common.dayjs';

const lineConfig = config().line;

export async function up(db: Kysely<any>): Promise<void> {
  //
  // ENUMS
  //
  await db.schema
    .createType('user_role')
    .asEnum(['ADMIN', 'MANAGER', 'USER'])
    .execute();

  await db.schema
    .createType('user_status')
    .asEnum(['ACTIVE', 'INACTIVE', 'PENDING_REGISTRATION'])
    .execute();

  await db.schema
    .createType('project_status')
    .asEnum(['ACTIVE', 'INACTIVE'])
    .execute();

  await db.schema
    .createType('document_status')
    .asEnum(['ACTIVE', 'INACTIVE'])
    .execute();

  await db.schema
    //
    .createType('chat_sender')
    .asEnum(['USER', 'BOT'])
    .execute();

  await db.schema
    //
    .createType('actor_type')
    .asEnum(['USER', 'SYSTEM'])
    .execute();

  await db.schema
    //
    .createType('action_type')
    .asEnum(['CREATE', 'UPDATE', 'DELETE'])
    .execute();

  await db.schema
    //
    .createType('line_session_status')
    .asEnum(['ACTIVE', 'INACTIVE'])
    .execute();

  await db.schema
    .createType('message_status')
    .asEnum(['INVALID_PAYLOAD', 'FAIL', 'SUCCESS', 'DEAD'])
    .execute();

  //
  // LINE_ACCOUNTS
  //
  await db.schema
    .createTable('line_accounts')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  //
  // USERS
  //
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .addColumn('password', 'text')
    .addColumn('last_signed_in_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('created_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('updated_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('role', sql`user_role`, (col) => col.notNull())
    .addColumn('user_status', sql`user_status`, (col) => col.notNull())
    .addColumn('line_account_id', 'text', (col) =>
      col.references('line_accounts.id').onDelete('set null').unique(),
    )
    .execute();

  //
  // USERS_VERIFICATION
  //
  await db.schema
    .createTable('user_verifications')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').notNull().onDelete('cascade'),
    )
    .addColumn('revoke_at', 'timestamptz')
    .addColumn('expire_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex('user_verifications_code_idx')
    .unique()
    .on('user_verifications')
    .columns(['code'])
    .where(sql`revoke_at`, 'is', null)
    .execute();

  //
  // USER GROUPS
  //
  await db.schema
    .createTable('user_groups')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('created_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('updated_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('group_name', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  await db.schema
    .createTable('user_group_users')
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('user_group_id', 'uuid', (col) =>
      col.notNull().references('user_groups.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('pk_user_group_users', [
      'user_id',
      'user_group_id',
    ])
    .execute();

  //
  // PROJECTS
  //
  await db.schema
    .createTable('projects')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('project_name', 'text', (col) => col.notNull())
    .addColumn('project_description', 'text', (col) =>
      col.notNull().defaultTo(''),
    )
    .addColumn('project_guideline_md', 'text', (col) =>
      col.notNull().defaultTo(''),
    )
    .addColumn('project_status', sql`project_status`, (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('created_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('updated_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('ai_summary_md', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  //
  // PROJECTS CHAT
  //
  await db.schema
    .createTable('project_chats')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('chat_sender', sql`chat_sender`, (col) => col.notNull())
    .addColumn('message', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('parent_id', 'uuid', (col) =>
      col.references('project_chats.id').onDelete('set null'),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
    .execute();

  //
  // USER GROUP PROJECTS
  //
  await db.schema
    .createTable('user_group_projects')
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
    .addColumn('user_group_id', 'uuid', (col) =>
      col.notNull().references('user_groups.id').onDelete('cascade'),
    )
    .addPrimaryKeyConstraint('pk_user_group_projects', [
      'project_id',
      'user_group_id',
    ])
    .execute();

  //
  // USERS MANAGE PROJECTS
  //
  await db.schema
    .createTable('user_manage_projects')
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addPrimaryKeyConstraint('pk_user_manage_projects', [
      'project_id',
      'user_id',
    ])
    .execute();

  //
  // PROJECT DOCUMENTS
  //
  await db.schema
    .createTable('project_documents')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
    .addColumn('created_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('updated_by_id', 'uuid', (col) =>
      col.references('users.id').onDelete('set null'),
    )
    .addColumn('document_details', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('document_status', sql`document_status`, (col) => col.notNull())
    .addColumn('ai_summary_md', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  //
  // STORED FILES
  //
  await db.schema
    .createTable('stored_files')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('ref_name', 'text', (col) => col.notNull())
    .addColumn('key_path', 'text', (col) => col.notNull())
    .addColumn('owner_table', 'text', (col) => col.notNull())
    .addColumn('owner_id', 'uuid', (col) => col.notNull())
    .addColumn('filename', 'text', (col) => col.notNull())
    .addColumn('filesize_byte', 'int8', (col) => col.notNull())
    .addColumn('storage_name', 'text', (col) => col.notNull().defaultTo('s3'))
    .addColumn('presign_url', 'text', (col) => col.notNull())
    .addColumn('is_public', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('mime_type', 'text', (col) => col.notNull())
    .addColumn('extension', 'text', (col) => col.notNull())
    .addColumn('checksum', 'text')
    .addColumn('expire_at', 'timestamptz')
    .execute();

  //
  // STORED FILES INDEXES
  //
  await db.schema
    .createIndex('stored_files_owner_id_ref_name_idx')
    .on('stored_files')
    .columns(['owner_id', 'ref_name'])
    .execute();

  //
  // LINE BOT
  //
  await db.schema
    .createTable('line_bots')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('channel_access_token', 'text', (col) => col.notNull())
    .addColumn('channel_secret', 'text', (col) => col.notNull())
    .execute();

  await db
    .insertInto('line_bots')
    .values({
      id: DEFAULT_LINEBOT_ID,
      created_at: myDayjs().toISOString(),
      updated_at: myDayjs().toISOString(),
      channel_access_token: lineConfig.defaultAccessToken,
      channel_secret: lineConfig.defaultSecret,
    })
    .execute();

  //
  // LINE SESSION
  //
  await db.schema
    .createTable('line_sessions')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('line_session_status', sql`line_session_status`, (col) =>
      col.notNull().defaultTo('ACTIVE'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('line_account_id', 'text', (col) =>
      col.references('line_accounts.id').notNull().onDelete('cascade'),
    )
    .addColumn('project_id', 'uuid', (col) =>
      col.references('projects.id').notNull().onDelete('cascade'),
    )
    .addColumn('line_bot_id', 'uuid', (col) =>
      col.references('line_bots.id').notNull().onDelete('cascade'),
    )
    .execute();

  //
  // CHAT LOGS
  //
  await db.schema
    .createTable('line_chat_logs')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('line_session_id', 'uuid', (col) =>
      col.references('line_sessions.id').notNull().onDelete('cascade'),
    )
    .addColumn('chat_sender', sql`chat_sender`, (col) => col.notNull())
    .addColumn('parent_id', 'uuid')
    .addColumn('message', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex('line_chat_logs_line_session_id_idx')
    .on('line_chat_logs')
    .column('line_session_id')
    .execute();

  // add last_chat_log_id for session
  await db.schema
    .alterTable('line_sessions')
    .addColumn('latest_chat_log_id', 'uuid', (col) =>
      col.references('line_chat_logs.id').onDelete('set null'),
    )
    .execute();

  //
  // AUDIT LOGS
  //
  await db.schema
    .createTable('audit_logs')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('actor_type', sql`actor_type`, (col) =>
      col.notNull().defaultTo('SYSTEM'),
    )
    .addColumn('action_type', sql`action_type`, (col) =>
      col.notNull().defaultTo('CREATE'),
    )
    .addColumn('action_detail', 'text', (col) => col.notNull().defaultTo(''))
    .addColumn('created_by_id', 'uuid', (col) => col.references('users.id'))
    .addColumn('owner_table', 'text', (col) => col.notNull())
    .addColumn('owner_id', 'uuid', (col) => col.notNull())
    .addColumn('raw_data', 'jsonb', (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex('audit_logs_owner_id_idx')
    .on('audit_logs')
    .column('owner_id')
    .execute();

  //
  // Sessions
  //
  await db.schema
    .createTable('sessions')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').notNull().onDelete('cascade'),
    )
    .addColumn('token_hash', 'text', (col) => col.notNull())
    .addColumn('device_uid', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('expire_at', 'timestamptz', (col) => col.notNull())
    .addColumn('revoke_at', 'timestamptz')
    .addColumn('info', 'jsonb', (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex('sessions_token_hash')
    .on('sessions')
    .column('token_hash')
    .execute();

  //
  // Password reset tokens
  //
  await db.schema
    .createTable('password_reset_tokens')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').notNull().onDelete('cascade'),
    )
    .addColumn('token_hash', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('expire_at', 'timestamptz', (col) => col.notNull())
    .addColumn('revoke_at', 'timestamptz')
    .execute();

  await db.schema
    .createIndex('password_reset_tokens_token_hash')
    .on('password_reset_tokens')
    .column('token_hash')
    .execute();

  await db.schema
    .createTable('message_tasks')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('queue_name', 'varchar', (col) => col.notNull())
    .addColumn('exchange_name', 'varchar', (col) => col.notNull())
    .addColumn('payload', 'jsonb', (col) => col.notNull())
    .addColumn('message_status', sql`message_status`, (col) => col.notNull())
    .addColumn('attempts', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('max_attempts', 'integer', (col) => col.notNull().defaultTo(5))
    .addColumn('last_error', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('expire_at', 'timestamptz', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes
  await db.schema.dropIndex('password_reset_tokens_token_hash').execute();
  await db.schema.dropIndex('sessions_token_hash').execute();
  await db.schema.dropIndex('audit_logs_owner_id_idx').execute();
  await db.schema.dropIndex('line_chat_logs_line_session_id_idx').execute();
  await db.schema.dropIndex('stored_files_owner_id_idx').execute();
  await db.schema.dropIndex('user_verifications_code_idx').execute();

  // Drop tables (reverse order of creation)
  await db.schema.dropTable('message_tasks').execute();
  await db.schema.dropTable('password_reset_tokens').execute();
  await db.schema.dropTable('sessions').execute();
  await db.schema.dropTable('audit_logs').execute();
  await db.schema.dropTable('line_chat_logs').execute();
  await db.schema.dropTable('line_sessions').execute();
  await db.schema.dropTable('line_bots').execute();
  await db.schema.dropTable('stored_files').execute();
  await db.schema.dropTable('project_documents').execute();
  await db.schema.dropTable('user_manage_projects').execute();
  await db.schema.dropTable('user_group_projects').execute();
  await db.schema.dropTable('project_chats').execute();
  await db.schema.dropTable('projects').execute();
  await db.schema.dropTable('user_group_users').execute();
  await db.schema.dropTable('user_groups').execute();
  await db.schema.dropTable('user_verifications').execute();
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('line_accounts').execute();

  // Drop enums/types (reverse order of creation)
  await db.schema.dropType('line_session_status').execute();
  await db.schema.dropType('action_type').execute();
  await db.schema.dropType('actor_type').execute();
  await db.schema.dropType('chat_sender').execute();
  await db.schema.dropType('document_status').execute();
  await db.schema.dropType('project_status').execute();
  await db.schema.dropType('user_status').execute();
  await db.schema.dropType('user_role').execute();
}
