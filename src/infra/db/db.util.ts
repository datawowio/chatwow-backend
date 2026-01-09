import type { SelectQueryBuilder, StringReference } from 'kysely';
import { sql } from 'kysely';

import {
  type PaginationQuery,
  getQueryPagination,
} from '@shared/common/common.pagination';
import type { ParsedSort } from '@shared/common/common.type';

import type { DB } from './db';

export async function queryCount(qb: SelectQueryBuilder<DB, any, any>) {
  const resp = await qb
    .clearSelect()
    .select(({ fn }) => fn.countAll().as('total'))
    .executeTakeFirst();

  if (!resp?.total) {
    return 0;
  }

  return parseInt(resp.total as string);
}

export async function queryExists(qb: SelectQueryBuilder<DB, any, any>) {
  const resp = await qb.clearSelect().select('id').executeTakeFirst();
  return !!resp?.id;
}

export function filterQbIds<DB, TB extends keyof DB & string, U>(
  ids: readonly string[],
  qb: SelectQueryBuilder<DB, TB, U>,
  ref: StringReference<DB, TB>,
): typeof qb {
  // Expand once, carry position
  const unnest = sql`unnest(${sql.val(ids)}::uuid[]) with ordinality as _ord(id, ord)`;

  return (
    qb
      .innerJoin(unnest as any, (j) => j.onRef(sql`_ord.id`, '=', ref as any))
      // @ts-expect-error complex solution for performance
      .orderBy(sql`_ord.ord`)
  );
}

type ColumnMap<DB, TB extends keyof DB & string, T extends string, O> = Record<
  T,
  (keyof O & string) | StringReference<DB, TB>
>;
export function sortQb<DB, TB extends keyof DB & string, T extends string, O>(
  qb: SelectQueryBuilder<DB, TB, O>,
  sorts: ParsedSort<T> | undefined,
  mapper: Readonly<ColumnMap<DB, TB, T, O>>,
): SelectQueryBuilder<DB, TB, O> {
  sorts ??= [];

  let q = qb;
  for (const [key, dir] of sorts) {
    const col = mapper[key];
    if (!col) continue; // ignore unknown keys at runtime

    q = q.orderBy(col, dir);
  }
  return q;
}

export function addPagination<DB, TB extends keyof DB & string, U>(
  qb: SelectQueryBuilder<DB, TB, U>,
  pagination: PaginationQuery | undefined,
) {
  const { limit, offset } = getQueryPagination(pagination);

  return qb
    .$if(!!limit, (q) => q.limit(limit!))
    .$if(!!offset, (q) => q.offset(offset!));
}
