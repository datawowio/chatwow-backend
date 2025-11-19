import { jsonArrayFrom } from 'kysely/helpers/postgres';
import type z from 'zod';

import type { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const projectsV1IncludesZod = getIncludesZod([
  'projectDocuments',
  'userGroups',
  'manageUsers',
]);
export function projectsV1InclusionQb(
  qb: SelectQB<'projects'>,
  includes: z.infer<typeof projectsV1IncludesZod>,
) {
  return qb
    .$if(includes.has('manageUsers'), (q) =>
      q.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('user_manage_projects')
            .innerJoin('users', 'users.id', 'user_manage_projects.user_id')
            .whereRef('user_manage_projects.project_id', '=', 'projects.id')
            .selectAll('users'),
        ).as('manageUsers'),
      ),
    )
    .$if(includes.has('projectDocuments'), (q) =>
      q.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('project_documents')
            .whereRef('project_documents.project_id', '=', 'projects.id')
            .selectAll('project_documents'),
        ).as('projectDocuments'),
      ),
    )
    .$if(includes.has('userGroups'), (q) =>
      q.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('user_group_projects')
            .innerJoin(
              'user_groups',
              'user_groups.id',
              'user_group_projects.user_group_id',
            )
            .whereRef('user_group_projects.project_id', '=', 'projects.id')
            .selectAll('user_groups'),
        ).as('userGroups'),
      ),
    );
}
