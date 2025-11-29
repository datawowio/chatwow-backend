import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';

import { MainDb } from '@infra/db/db.main';

@Injectable()
export class PgService {
  constructor(private db: MainDb) {}

  async getTableEnums(opts: { table: string; enumType?: string }) {
    const raw = await (this.db.read as Kysely<any>)
      .selectFrom('information_schema.columns as c')
      .innerJoin('pg_type as t', 't.typname', 'c.udt_name')
      .innerJoin('pg_enum as e', 'e.enumtypid', 't.oid')
      .select([
        // 'c.column_name as colName',
        'c.udt_name as enumType',
        'e.enumlabel as label',
      ])
      .where('c.table_name', '=', opts.table)
      .where('c.data_type', '=', 'USER-DEFINED')
      .$if(!!opts.enumType, (q) => q.where('c.udt_name', '=', opts.enumType))
      .orderBy('c.ordinal_position')
      .orderBy('e.enumsortorder')
      .$castTo<{
        enumType: string;
        label: string;
      }>()
      .execute();

    return raw;
  }
}
