import { promises as fs } from 'fs';
import type {
  Expression,
  ExpressionBuilder,
  Kysely,
  OperandExpression,
  SelectQueryBuilder,
  Selectable,
  SqlBool,
  StringReference,
  Transaction,
} from 'kysely';
import { FileMigrationProvider, Migrator, sql } from 'kysely';
import type { InsertObject } from 'kysely/dist/cjs/parser/insert-values-parser';
import type { UpdateObject } from 'kysely/dist/cjs/parser/update-set-parser';
import * as path from 'path';
import type { DatabaseError } from 'pg';
import { Except } from 'type-fest';

import type { DB } from './db';

export const KYSELY = 'KYSELY';
export const READ_DB = Symbol('READ_DB');

export type CoreDB = Kysely<DB>;

type writeOperation =
  | 'deleteFrom'
  | 'updateTable'
  | 'insertInto'
  | 'replaceInto'
  | 'mergeInto';
export type ReadDB = Omit<CoreDB, writeOperation | 'transaction'>;
export type WriteDB = Except<CoreDB, 'selectFrom' | 'selectNoFrom'>;

export type TxDB = Transaction<DB>;
export type DBInsertData<T extends keyof DB> = InsertObject<DB, T>;
export type DBUpdateData<T extends keyof DB> = UpdateObject<DB, T, T>;
export type DBModel<T> = Selectable<T>;
export type Strict<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

export type EB<T extends keyof DB> = ExpressionBuilder<DB, T>;
export type Ref<T extends keyof DB> = StringReference<DB, T>;
export type EX<T> = Expression<T>;
export type SelectQB<T extends keyof DB> = SelectQueryBuilder<DB, T, object>;
export type SelectAnyQB<T extends keyof DB> = SelectQueryBuilder<DB, T, any>;
export type WhereBuilder = OperandExpression<SqlBool>[];

export async function runMigrations(db: CoreDB) {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  return migrator.migrateToLatest();
}

export function getErrorKey(e: DatabaseError) {
  switch (e.code) {
    case '23505': // unique_violation
      return 'exists';
    case '23503': // foreign_key_violation
      return 'invalidRef';
    default:
      return 'internal';
  }
}

export async function pingDatabase(db: Kysely<any>) {
  try {
    // Execute 'SELECT 1' to verify connection
    await sql`SELECT 1`.execute(db);
    return true;
  } catch (error) {
    throw error;
  }
}
