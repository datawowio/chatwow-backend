import { jsonObjectFrom } from 'kysely/helpers/postgres';
import z from 'zod';

import { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const listProjectChatSessionIncludesZod = getIncludesZod([
  'initChatLog',
  'latestChatLog',
]);

export function listProjectChatSessionInclusionQb(
  qb: SelectQB<'project_chat_sessions'>,
  includes: z.infer<typeof listProjectChatSessionIncludesZod>,
) {
  return qb
    .$if(includes.has('initChatLog'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('project_chat_logs')
            .whereRef(
              'project_chat_logs.id',
              '=',
              'project_chat_sessions.init_chat_log_id',
            )
            .selectAll('project_chat_logs'),
        ).as('initChatLog'),
      ),
    )
    .$if(includes.has('latestChatLog'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('project_chat_logs')
            .whereRef(
              'project_chat_logs.id',
              '=',
              'project_chat_sessions.latest_chat_log_id',
            )
            .selectAll('project_chat_logs'),
        ).as('latestChatLog'),
      ),
    );
}
