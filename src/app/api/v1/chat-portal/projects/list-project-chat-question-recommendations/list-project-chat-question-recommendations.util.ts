import { jsonObjectFrom } from 'kysely/helpers/postgres';
import z from 'zod';

import { SelectQB } from '@infra/db/db.common';

import { getIncludesZod } from '@shared/zod/zod.util';

export const listProjectChatQuestionRecommendationIncludesZod = getIncludesZod([
  'project',
]);

export function listProjectChatQuestionRecommendationInclusionQb(
  qb: SelectQB<'project_chat_question_recommendations'>,
  includes: z.infer<typeof listProjectChatQuestionRecommendationIncludesZod>,
) {
  return qb.$if(includes.has('project'), (q) =>
    q.select((eb) =>
      jsonObjectFrom(
        eb
          .selectFrom('projects')
          .whereRef(
            'projects.id',
            '=',
            'project_chat_question_recommendations.project_id',
          )
          .selectAll('projects'),
      ).as('project'),
    ),
  );
}
