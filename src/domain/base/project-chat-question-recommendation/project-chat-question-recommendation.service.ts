import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { getErrorKey } from '@infra/db/db.common';
import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { ProjectChatQuestionRecommendation } from './project-chat-question-recommendation.domain';
import {
  projectChatQuestionRecommendationFromPgWithState,
  projectChatQuestionRecommendationToPg,
} from './project-chat-question-recommendation.mapper';
import { projectChatQuestionRecommendationsTableFilter } from './project-chat-question-recommendation.util';
import {
  ProjectChatQuestionRecommendationCountQueryOptions,
  ProjectChatQuestionRecommendationQueryOptions,
} from './project-chat-question-recommendation.zod';

@Injectable()
export class ProjectChatQuestionRecommendationService {
  constructor(private db: MainDb) {}

  async getIds(opts?: ProjectChatQuestionRecommendationQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('project_chat_question_recommendations.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'project_chat_question_recommendations.id',
          createdAt: 'project_chat_question_recommendations.created_at',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: ProjectChatQuestionRecommendationCountQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb({
        filter: opts?.filter,
      })
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string) {
    const projectChatQuestionRecommendationPg = await this.db.read
      .selectFrom('project_chat_question_recommendations')
      .selectAll()
      .where('id', '=', id)
      .where(projectChatQuestionRecommendationsTableFilter)
      .limit(1)
      .executeTakeFirst();

    if (!projectChatQuestionRecommendationPg) {
      return null;
    }

    const projectChatQuestionRecommendation =
      projectChatQuestionRecommendationFromPgWithState(
        projectChatQuestionRecommendationPg,
      );
    return projectChatQuestionRecommendation;
  }

  async findMany(ids: string[]) {
    const projectChatQuestionRecommendationPgs = await this.db.read
      .selectFrom('project_chat_question_recommendations')
      .selectAll()
      .where('id', 'in', ids)
      .where(projectChatQuestionRecommendationsTableFilter)
      .execute();

    return projectChatQuestionRecommendationPgs.map((p) =>
      projectChatQuestionRecommendationFromPgWithState(p),
    );
  }

  async save(
    projectChatQuestionRecommendation: ProjectChatQuestionRecommendation,
  ) {
    this._validate(projectChatQuestionRecommendation);

    if (!projectChatQuestionRecommendation.isPersist) {
      await this._create(projectChatQuestionRecommendation);
    } else {
      await this._update(
        projectChatQuestionRecommendation.id,
        projectChatQuestionRecommendation,
      );
    }

    projectChatQuestionRecommendation.setPgState(
      projectChatQuestionRecommendationToPg,
    );
  }

  async saveBulk(
    projectChatQuestionRecommendations: ProjectChatQuestionRecommendation[],
  ) {
    return Promise.all(
      projectChatQuestionRecommendations.map((p) => this.save(p)),
    );
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('project_chat_question_recommendations')
      .where('id', '=', id)
      .execute();
  }

  private _validate(
    _projectChatQuestionRecommendation: ProjectChatQuestionRecommendation,
  ) {
    // validation rules can be added here
  }

  private async _create(
    projectChatQuestionRecommendation: ProjectChatQuestionRecommendation,
  ) {
    await this._tryWrite(async () =>
      this.db.write
        //
        .insertInto('project_chat_question_recommendations')
        .values(
          projectChatQuestionRecommendationToPg(
            projectChatQuestionRecommendation,
          ),
        )
        .execute(),
    );
  }

  private async _update(
    id: string,
    projectChatQuestionRecommendation: ProjectChatQuestionRecommendation,
  ) {
    const data = diff(
      projectChatQuestionRecommendation.pgState,
      projectChatQuestionRecommendationToPg(projectChatQuestionRecommendation),
    );
    if (!data) {
      return;
    }

    await this._tryWrite(async () =>
      this.db.write
        //
        .updateTable('project_chat_question_recommendations')
        .set(data)
        .where('id', '=', id)
        .execute(),
    );
  }

  private async _tryWrite<T>(cb: () => Promise<T>) {
    try {
      const data = await cb();
      return data;
    } catch (e: any) {
      const errKey = getErrorKey(e);
      if (errKey === 'exists') {
        throw new ApiException(409, 'alreadyExists');
      }

      throw new ApiException(500, 'internal');
    }
  }

  private _getFilterQb(
    opts?: Except<ProjectChatQuestionRecommendationQueryOptions, 'pagination'>,
  ) {
    const filter = opts?.filter;

    return this.db.read
      .selectFrom('project_chat_question_recommendations')
      .select('project_chat_question_recommendations.id')
      .where(projectChatQuestionRecommendationsTableFilter)
      .$if(isDefined(filter?.projectId), (q) =>
        q.where(
          'project_chat_question_recommendations.project_id',
          '=',
          filter!.projectId!,
        ),
      )
      .$if(isDefined(filter?.userId), (q) =>
        q
          .innerJoin(
            'projects',
            'projects.id',
            'project_chat_question_recommendations.project_id',
          )
          .innerJoin(
            'user_group_projects',
            'user_group_projects.project_id',
            'projects.id',
          )
          .innerJoin(
            'user_group_users',
            'user_group_users.user_group_id',
            'user_group_projects.user_group_id',
          )
          .where('user_group_users.user_id', '=', filter!.userId!),
      )
      .$if(!!filter?.projectIds?.length, (q) =>
        q.where(
          'project_chat_question_recommendations.project_id',
          'in',
          filter!.projectIds!,
        ),
      )
      .$if(isDefined(filter?.search), (q) => {
        const search = `%${filter!.search!}%`;

        return q.where((eb) =>
          eb.or([
            eb(
              'project_chat_question_recommendations.question_text',
              'ilike',
              search,
            ),
          ]),
        );
      });
  }
}
