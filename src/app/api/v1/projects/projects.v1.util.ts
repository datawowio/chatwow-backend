import { projectDocumentsTableFilter } from '@domain/base/project-document/project-document.util';
import { userGroupsTableFilter } from '@domain/base/user-group/user-group.utils';
import { usersTableFilter } from '@domain/base/user/user.util';
import { jsonArrayFrom, jsonObjectFrom } from 'kysely/helpers/postgres';
import type z from 'zod';

import type { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const projectsV1IncludesZod = getIncludesZod([
  'projectDocuments',
  'projectDocuments.storedFile',
  'projectDocuments.createdBy',
  'projectDocuments.updatedBy',
  'userGroups',
  'manageUsers',
  'createdBy',
  'updatedBy',
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
            .where(projectDocumentsTableFilter)
            .selectAll('project_documents')
            .$if(includes.has('projectDocuments.createdBy'), (q) =>
              q.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom('users')
                    .where(usersTableFilter)
                    .selectAll()
                    .whereRef(
                      'users.id',
                      '=',
                      'project_documents.created_by_id',
                    ),
                ).as('createdBy'),
              ),
            )
            .$if(includes.has('projectDocuments.updatedBy'), (q) =>
              q.select((eb) =>
                jsonObjectFrom(
                  eb
                    .selectFrom('users')
                    .where(usersTableFilter)
                    .selectAll()
                    .whereRef(
                      'users.id',
                      '=',
                      'project_documents.updated_by_id',
                    ),
                ).as('updatedBy'),
              ),
            )
            .$if(includes.has('projectDocuments.storedFile'), (q) =>
              q.select((eb) => [
                jsonObjectFrom(
                  eb
                    .selectFrom('stored_files')
                    .selectAll()
                    .whereRef(
                      'stored_files.owner_id',
                      '=',
                      'project_documents.id',
                    ),
                ).as('storedFile'),
              ]),
            ),
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
            .where(userGroupsTableFilter)
            .selectAll('user_groups'),
        ).as('userGroups'),
      ),
    )
    .$if(includes.has('createdBy'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .where(usersTableFilter)
            .selectAll()
            .whereRef('users.id', '=', 'projects.created_by_id'),
        ).as('createdBy'),
      ),
    )
    .$if(includes.has('updatedBy'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .where(usersTableFilter)
            .selectAll()
            .whereRef('users.id', '=', 'projects.updated_by_id'),
        ).as('updatedBy'),
      ),
    );
}
