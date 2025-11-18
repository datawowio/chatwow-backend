import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  //
  // ENUMS
  //
  await db.schema.createType('user_role').asEnum(['ADMIN', 'USER']).execute();

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
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('password', 'text')
    .addColumn('last_signed_in_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('role', sql`user_role`, (col) => col.notNull())
    .addColumn('user_status', sql`user_status`, (col) => col.notNull())
    .addColumn('line_account_id', 'text', (col) =>
      col.references('line_accounts.id').onDelete('set null').unique(),
    )
    .execute();

  //
  // USERS_OTP
  //
  await db.schema
    .createTable('user_otps')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').notNull().onDelete('cascade'),
    )
    .addColumn('expire_at', 'timestamptz', (col) => col.notNull())
    .execute();

  //
  // USER GROUPS
  //
  await db.schema
    .createTable('user_groups')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('group_name', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  await db.schema
    .createTable('user_group_users')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .addColumn('user_group_id', 'uuid', (col) =>
      col.notNull().references('user_groups.id').onDelete('cascade'),
    )
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
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
    .addColumn('user_group_id', 'uuid', (col) =>
      col.notNull().references('user_groups.id').onDelete('cascade'),
    )
    .execute();

  //
  // USERS MANAGE PROJECTS
  //
  await db.schema
    .createTable('user_manage_projects')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.notNull().references('users.id').onDelete('cascade'),
    )
    .execute();

  //
  // PROJECT DOCUMENTS
  //
  await db.schema
    .createTable('project_documents')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
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
    .createIndex('stored_files_ref_owner_idx')
    .on('stored_files')
    .columns(['owner_table', 'owner_id'])
    .execute();

  //
  // LINE SESSION
  //
  await db.schema
    .createTable('line_sessions')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
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
    .execute();

  // add active session
  await db.schema
    .alterTable('line_accounts')
    .addColumn('active_line_session_id', 'uuid', (col) =>
      col.references('line_sessions.id').onDelete('set null'),
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
    .addColumn('parent_id', 'uuid', (col) =>
      col.references('line_chat_logs.id').onDelete('set null'),
    )
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
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes
  await db.schema.dropIndex('stored_files_ref_owner_idx').execute();
  await db.schema.dropIndex('line_chat_logs_line_session_id_idx').execute();

  // Drop tables (reverse order of creation)
  await db.schema.dropTable('audit_logs').execute();
  await db.schema.dropTable('line_chat_logs').execute();
  await db.schema.dropTable('line_sessions').execute();
  await db.schema.dropTable('stored_files').execute();
  await db.schema.dropTable('project_documents').execute();
  await db.schema.dropTable('user_manage_projects').execute();
  await db.schema.dropTable('user_group_projects').execute();
  await db.schema.dropTable('project_chats').execute();
  await db.schema.dropTable('projects').execute();
  await db.schema.dropTable('user_group_users').execute();
  await db.schema.dropTable('user_groups').execute();
  await db.schema.dropTable('user_otps').execute();
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('line_accounts').execute();

  // Drop enums/types (reverse order of creation)
  await db.schema.dropType('action_type').execute();
  await db.schema.dropType('actor_type').execute();
  await db.schema.dropType('chat_sender').execute();
  await db.schema.dropType('document_status').execute();
  await db.schema.dropType('project_status').execute();
  await db.schema.dropType('user_status').execute();
  await db.schema.dropType('user_role').execute();
}
