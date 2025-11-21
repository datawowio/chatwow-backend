import { Injectable } from '@nestjs/common';
import { Except } from 'type-fest';

import { addPagination, queryCount, sortQb } from '@infra/db/db.util';

import { diff, getUniqueIds } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';
import { isDefined } from '@shared/common/common.validator';

import { Project } from './project.domain';
import { ProjectMapper } from './project.mapper';
import { projectsTableFilter } from './project.util';
import { ProjectCountQueryOptions, ProjectQueryOptions } from './project.zod';

@Injectable()
export class ProjectRepo extends BaseRepo {
  async getIds(opts?: ProjectQueryOptions) {
    opts ??= {};
    const { sort, pagination } = opts;

    const qb = await this._getFilterQb(opts)
      .select('projects.id')
      .$if(!!sort?.length, (q) =>
        sortQb(q, opts!.sort, {
          id: 'projects.id',
          createdAt: 'projects.created_at',
          projectName: 'projects.project_name',
        }),
      )
      .$call((q) => addPagination(q, pagination))
      .execute();

    return getUniqueIds(qb);
  }

  async getCount(opts?: ProjectCountQueryOptions) {
    const totalCount = await this
      //
      ._getFilterQb({
        filter: opts?.filter,
      })
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async create(project: Project): Promise<void> {
    await this.db
      //
      .insertInto('projects')
      .values(ProjectMapper.toPg(project))
      .execute();
  }

  async update(id: string, project: Project): Promise<void> {
    const data = diff(project.pgState, ProjectMapper.toPg(project));
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('projects')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<Project | null> {
    const projectPg = await this.readDb
      .selectFrom('projects')
      .selectAll()
      .where(projectsTableFilter)
      .where('id', '=', id)
      .executeTakeFirst();

    if (!projectPg) {
      return null;
    }

    const project = ProjectMapper.fromPgWithState(projectPg);
    return project;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('projects')
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: Except<ProjectQueryOptions, 'pagination'>) {
    const filter = opts?.filter;

    return this.readDb
      .selectFrom('projects')
      .select('projects.id')
      .where(projectsTableFilter)
      .$if(isDefined(filter?.projectName), (q) =>
        q.where('projects.project_name', '=', filter!.projectName!),
      )
      .$if(isDefined(filter?.projectStatus), (q) =>
        q.where('projects.project_status', '=', filter!.projectStatus!),
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
}
