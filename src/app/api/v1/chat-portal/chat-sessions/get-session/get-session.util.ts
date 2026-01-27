import { jsonObjectFrom } from 'kysely/helpers/postgres';
import z from 'zod';

import { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const getSessionIncludesZod = getIncludesZod(['project', 'user']);
export function getSessionInclusionQb(
  qb: SelectQB<'project_chat_sessions'>,
  includes: z.infer<typeof getSessionIncludesZod>,
) {
  return qb
    .$if(includes.has('project'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('projects')
            .whereRef('projects.id', '=', 'project_chat_sessions.project_id')
            .selectAll('projects'),
        ).as('project'),
      ),
    )
    .$if(includes.has('user'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .whereRef('users.id', '=', 'project_chat_sessions.user_id')
            .selectAll('users'),
        ).as('user'),
      ),
    );
}
