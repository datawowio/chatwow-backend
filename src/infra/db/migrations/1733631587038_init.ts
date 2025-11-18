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

  //
  // USERS
  //
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('password', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('role', sql`user_role`, (col) => col.notNull())
    .addColumn('user_status', sql`user_status`, (col) => col.notNull())
    .addColumn('line_uid', 'text')
    .execute();

  //
  // USERS_OTP
  //
  await db.schema
    .createTable('user_otps')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('otp', 'text', (col) => col.unique().notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('user_id', 'uuid', (col) =>
      col.references('users.id').notNull().onDelete('cascade'),
    )
    .addColumn('expire_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex('user_otps_otp')
    .on('user_otps')
    .column('otp')
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
    .execute();

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
  // PROJECT DOCUMENTS
  //
  await db.schema
    .createTable('project_documents')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('document_status', sql`document_status`, (col) => col.notNull())
    .addColumn('ai_summary_md', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  //
  // PROJECT AI SUMMARIES
  //
  await db.schema
    .createTable('project_ai_summaries')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('project_id', 'uuid', (col) =>
      col.notNull().references('projects.id').onDelete('cascade'),
    )
    .addColumn('ai_summary_md', 'text', (col) => col.notNull().defaultTo(''))
    .execute();

  await db.schema
    .alterTable('projects')
    .addColumn('current_project_ai_summary_id', 'uuid', (col) =>
      col.references('project_ai_summaries.id').onDelete('set null'),
    )
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
    .columns(['ref_name', 'owner_table', 'owner_id'])
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('stored_files_ref_owner_idx').execute();
  await db.schema.dropTable('stored_files').execute();
  await db.schema.dropTable('project_ai_summaries').execute();
  await db.schema.dropTable('project_documents').execute();
  await db.schema.dropTable('user_group_projects').execute();
  await db.schema.dropTable('projects').execute();
  await db.schema.dropTable('user_group_users').execute();
  await db.schema.dropTable('user_groups').execute();
  await db.schema.dropTable('users').execute();

  await db.schema.dropType('document_status').execute();
  await db.schema.dropType('project_status').execute();
  await db.schema.dropType('user_status').execute();
  await db.schema.dropType('user_role').execute();
}
