import { lineAccountsTableFilter } from '@domain/base/line-account/line-account.util';
import { projectsTableFilter } from '@domain/base/project/project.util';
import {
  addUserGroupActorFilter,
  userGroupsTableFilter,
} from '@domain/base/user-group/user-group.utils';
import { usersTableFilter } from '@domain/base/user/user.util';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import type z from 'zod';

import type { SelectQB } from '@infra/db/db.common';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { isDefined } from '@shared/common/common.validator';
import { getIncludesZod } from '@shared/zod/zod.util';

export const usersV1IncludesZod = getIncludesZod([
  'department',
  'manageProjects',
  'userGroups',
  'lineAccount',
  'createdBy',
  'updatedBy',
]);

export function usersV1InclusionQb(
  qb: SelectQB<'users'>,
  includes: z.infer<typeof usersV1IncludesZod>,
  actor?: UserClaims,
) {
  return qb
    .$if(includes.has('department'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('departments')
            .whereRef('departments.id', '=', 'users.department_id')
            .selectAll('departments'),
        ).as('department'),
      ),
    )
    .$if(includes.has('manageProjects'), (q) =>
      q.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('user_manage_projects')
            .innerJoin(
              'projects',
              'projects.id',
              'user_manage_projects.project_id',
            )
            .whereRef('user_manage_projects.user_id', '=', 'users.id')
            .where(projectsTableFilter)
            .selectAll('projects'),
        ).as('manageProjects'),
      ),
    )
    .$if(includes.has('userGroups'), (q) =>
      q.select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('user_group_users')
            .innerJoin(
              'user_groups',
              'user_groups.id',
              'user_group_users.user_group_id',
            )
            .$if(isDefined(actor), (q) => addUserGroupActorFilter(q, actor!))
            .whereRef('user_group_users.user_id', '=', 'users.id')
            .where(userGroupsTableFilter)
            .selectAll('user_groups'),
        ).as('userGroups'),
      ),
    )
    .$if(includes.has('lineAccount'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('line_accounts')
            .whereRef('line_accounts.id', '=', 'users.line_account_id')
            .where(lineAccountsTableFilter)
            .selectAll('line_accounts'),
        ).as('lineAccount'),
      ),
    )
    .$if(includes.has('createdBy'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users as creator')
            .whereRef('creator.id', '=', 'users.created_by_id')
            .where(usersTableFilter)
            .selectAll(),
        ).as('createdBy'),
      ),
    )
    .$if(includes.has('updatedBy'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users as updator')
            .whereRef('updator.id', '=', 'users.updated_by_id')
            .where(usersTableFilter)
            .selectAll(),
        ).as('updatedBy'),
      ),
    );
}
