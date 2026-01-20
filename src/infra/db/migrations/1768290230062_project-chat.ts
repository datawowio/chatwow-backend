import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  //
  // PROJECT CHAT BOOKMARKS
  //
  await db.schema
    .createTable('project_chat_bookmarks')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('bookmark_text', 'text', (col) => col.notNull())
    .addColumn('created_by_id', 'uuid', (col) =>
      col.references('users.id').notNull(),
    )
    .addColumn('project_id', 'uuid', (col) =>
      col.references('projects.id').notNull(),
    )
    .execute();

  await db.schema
    .createIndex('project_chat_bookmarks_project_id_idx')
    .on('project_chat_bookmarks')
    .column('project_id')
    .execute();

  //
  // PROJECT CHAT QUESTION RECOMMENDATIONS
  //
  await db.schema
    .createTable('project_chat_question_recommendations')
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('question_text', 'text', (col) => col.notNull())
    .addColumn('project_id', 'uuid', (col) =>
      col.references('projects.id').notNull(),
    )
    .execute();

  await db.schema
    .createIndex('project_chat_question_recommendations_project_id_idx')
    .on('project_chat_question_recommendations')
    .column('project_id')
    .execute();

  //
  // PROJECT CHAT SESSION ALTER
  //
  await db.schema
    .createType('session_status')
    .asEnum(['ACTIVE', 'DEPRECATED'])
    .execute();

  await db.schema
    .alterTable('project_chat_sessions')
    .addColumn('init_chat_log_id', 'uuid')
    .addColumn('session_status', sql`session_status`, (col) =>
      col.notNull().defaultTo('ACTIVE'),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('project_chat_question_recommendations').execute();
  await db.schema
    .dropIndex('project_chat_question_recommendations_project_id_idx')
    .execute();

  await db.schema.dropTable('project_chat_bookmarks').execute();
  await db.schema.dropIndex('project_chat_bookmarks_project_id_idx').execute();

  await db.schema
    .alterTable('project_chat_sessions')
    .dropColumn('init_chat_log_id')
    .execute();
}
