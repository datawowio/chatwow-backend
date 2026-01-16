import { jsonObjectFrom } from 'kysely/helpers/postgres';
import z from 'zod';

import { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const getSessionIncludesZod = getIncludesZod(['project']);
export function getSessionInclusionQb(
  qb: SelectQB<'project_chat_sessions'>,
  includes: z.infer<typeof getSessionIncludesZod>,
) {
  return qb.$if(includes.has('project'), (q) =>
    q.select((eb) =>
      jsonObjectFrom(
        eb
          .selectFrom('projects')
          .whereRef('projects.id', '=', 'project_chat_sessions.project_id')
          .selectAll('projects'),
      ).as('project'),
    ),
  );
}
