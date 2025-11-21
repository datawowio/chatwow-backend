import { Injectable } from '@nestjs/common';

import { Project } from './project.domain';
import { ProjectMapper } from './project.mapper';
import { ProjectRepo } from './project.repo';
import { ProjectCountQueryOptions, ProjectQueryOptions } from './project.zod';

@Injectable()
export class ProjectService {
  constructor(private repo: ProjectRepo) {}

  async getIds(query?: ProjectQueryOptions) {
    return this.repo.getIds(query);
  }

  async getCount(query?: ProjectCountQueryOptions) {
    return this.repo.getCount(query);
  }

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async save(project: Project) {
    this._validate(project);

    if (!project.isPersist) {
      await this.repo.create(project);
    } else {
      await this.repo.update(project.id, project);
    }

    project.setPgState(ProjectMapper.toPg);
  }

  async saveBulk(projects: Project[]) {
    return Promise.all(projects.map((p) => this.save(p)));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  private _validate(_project: Project) {
    // validation rules can be added here
  }
}
