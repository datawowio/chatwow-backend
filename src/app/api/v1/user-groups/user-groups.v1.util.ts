import { projectsTableFilter } from '@domain/base/project/project.util';
import { usersTableFilter } from '@domain/base/user/user.util';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import type z from 'zod';

import type { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const userGroupsV1IncludesZod = getIncludesZod([
  'users',
  'projects',
  'createdBy',
  'updatedBy',
]);
export function userGroupsV1InclusionQb(
  qb: SelectQB<'user_groups'>,
  includes: z.infer<typeof userGroupsV1IncludesZod>,
) {
  return qb
    .$if(includes.has('projects'), (q) =>
      q.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('user_group_projects')
            .innerJoin(
              'projects',
              'projects.id',
              'user_group_projects.project_id',
            )
            .whereRef(
              'user_group_projects.user_group_id',
              '=',
              'user_groups.id',
            )
            .where(projectsTableFilter)
            .selectAll(),
        ).as('projects'),
      ),
    )
    .$if(includes.has('users'), (q) =>
      q.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('user_group_users')
            .innerJoin('users', 'users.id', 'user_group_users.user_id')
            .where(usersTableFilter)
            .whereRef('user_group_users.user_group_id', '=', 'user_groups.id')
            .selectAll(),
        ).as('users'),
      ),
    )
    .$if(includes.has('createdBy'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .whereRef('users.id', '=', 'user_groups.created_by_id')
            .where(usersTableFilter)
            .selectAll(),
        ).as('createdBy'),
      ),
    )
    .$if(includes.has('updatedBy'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .whereRef('users.id', '=', 'user_groups.updated_by_id')
            .where(usersTableFilter)
            .selectAll(),
        ).as('updatedBy'),
      ),
    );
}
