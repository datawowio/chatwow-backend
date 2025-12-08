import { DomainEventQueue } from '@domain/queue/domain-event/domain-event.queue';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { addPagination, queryCount, sortQb } from '@infra/db/db.util';
import { UserClaims } from '@infra/middleware/jwt/jwt.common';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { Project } from './project.domain';
import { projectFromPgWithState, projectToPg } from './project.mapper';
import { ProjectSaveOpts } from './project.type';
import { addProjectActorFilter, projectsTableFilter } from './project.util';
import { ProjectFilterOptions, ProjectQueryOptions } from './project.zod';

@Injectable()
export class ProjectService {
  constructor(
    private db: MainDb,
    private domainEventQueue: DomainEventQueue,
  ) {}

  async getIds(opts?: ProjectQueryOptions) {
    const { sort, pagination, filter } = opts?.options || {};

    const qb = await this._getFilterQb({
      filter,
      actor: opts?.actor,
    })
      .select('projects.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, sort, {
          id: 'projects.id',
          createdAt: 'projects.created_at',
          projectName: 'projects.project_name',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: ProjectFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(id: string, actor?: UserClaims): Promise<Project | null> {
    const projectPg = await this.db.read
      .selectFrom('projects')
      .selectAll('projects')
      .where(projectsTableFilter)
      .where('id', '=', id)
      .limit(1)
      .$if(isDefined(actor), (q) => addProjectActorFilter(q, actor!))
      .executeTakeFirst();

    if (!projectPg) {
      return null;
    }

    const project = projectFromPgWithState(projectPg);
    return project;
  }

  async save(project: Project, opts?: ProjectSaveOpts) {
    this._validate(project);

    if (!project.isPersist) {
      await this._create(project);
    } else {
      await this._update(project.id, project);
    }

    project.setPgState(projectToPg);

    const disableEvent = opts?.disableEvent ?? false;
    if (!disableEvent) {
      this.domainEventQueue.jobSavedProject(project);
    }
  }

  async saveBulk(projects: Project[], opts?: ProjectSaveOpts) {
    return Promise.all(projects.map((p) => this.save(p, opts)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('projects')
      .where('id', '=', id)
      .execute();
  }

  private async _create(project: Project): Promise<void> {
    await this.db.write
      //
      .insertInto('projects')
      .values(projectToPg(project))
      .execute();
  }

  private async _update(id: string, project: Project): Promise<void> {
    const data = diff(project.pgState, projectToPg(project));
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('projects')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: ProjectFilterOptions) {
    const { filter, actor } = opts || {};

    return this.db.read
      .selectFrom('projects')
      .select('projects.id')
      .where(projectsTableFilter)
      .$if(isDefined(actor), (q) => addProjectActorFilter(q, actor!))
      .$if(isDefined(filter?.projectName), (q) =>
        q.where('projects.project_name', '=', filter!.projectName!),
      )
      .$if(isDefined(filter?.projectStatus), (q) =>
        q.where('projects.project_status', '=', filter!.projectStatus!),
      )
      .$if(isDefined(filter?.userId), (q) =>
        q
          .leftJoin(
            'user_group_projects',
            'user_group_projects.project_id',
            'projects.id',
          )
          .leftJoin(
            'user_group_users',
            'user_group_users.user_group_id',
            'user_group_users.user_group_id',
          )
          .where('user_group_users.user_id', '=', filter!.userId!),
      )
      .$if(!!filter?.userGroupIds?.length, (q) =>
        q
          .leftJoin(
            'user_group_projects',
            'user_group_projects.project_id',
            'projects.id',
          )
          .where(
            'user_group_projects.user_group_id',
            'in',
            filter!.userGroupIds!,
          ),
      )
      .$if(!!filter?.manageUserIds?.length, (q) =>
        q
          .leftJoin(
            'user_manage_projects',
            'user_manage_projects.project_id',
            'projects.id',
          )
          .where('user_manage_projects.user_id', 'in', filter!.manageUserIds!),
      )
      .$if(isDefined(filter?.lineAccountId), (q) =>
        q
          .leftJoin(
            'user_group_projects',
            'user_group_projects.project_id',
            'projects.id',
          )
          .leftJoin(
            'user_group_users',
            'user_group_users.user_group_id',
            'user_group_users.user_group_id',
          )
          .leftJoin('users', 'users.id', 'user_group_users.user_id')
          .where('users.line_account_id', '=', filter!.lineAccountId!),
      )
      .$if(isDefined(filter?.search), (q) => {
        const search = `%${filter!.search!}%`;

        return q.where((eb) =>
          eb.or([
            //
            eb('projects.project_name', 'ilike', search),
            eb('projects.project_description', 'ilike', search),
          ]),
        );
      });
  }

  private _validate(_project: Project) {
    // validation rules can be added here
  }
}
