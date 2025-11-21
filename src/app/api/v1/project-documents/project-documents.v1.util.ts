import { projectsTableFilter } from '@domain/base/project/project.util';
import { usersTableFilter } from '@domain/base/user/user.util';
import { jsonObjectFrom } from 'kysely/helpers/postgres';
import type z from 'zod';

import type { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const projectDocumentsV1IncludesZod = getIncludesZod([
  'project',
  'storedFile',
  'createdBy',
  'updatedBy',
]);
export function projectDocumentsV1InclusionQb(
  qb: SelectQB<'project_documents'>,
  includes: z.infer<typeof projectDocumentsV1IncludesZod>,
) {
  return qb
    .$if(includes.has('project'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('projects')
            .whereRef('projects.id', '=', 'project_documents.project_id')
            .where(projectsTableFilter)
            .selectAll(),
        ).as('project'),
      ),
    )
    .$if(includes.has('storedFile'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('stored_files')
            .whereRef('stored_files.owner_id', '=', 'project_documents.id')
            .selectAll(),
        ).as('storedFile'),
      ),
    )
    .$if(includes.has('createdBy'), (q) =>
      q.select((eb) =>
        jsonObjectFrom(
          eb
            .selectFrom('users')
            .whereRef('users.id', '=', 'project_documents.created_by_id')
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
            .whereRef('users.id', '=', 'project_documents.updated_by_id')
            .where(usersTableFilter)
            .selectAll(),
        ).as('updatedBy'),
      ),
    );
}
