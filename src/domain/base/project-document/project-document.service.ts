import { Injectable } from '@nestjs/common';

import { ProjectDocument } from './project-document.domain';
import { ProjectDocumentMapper } from './project-document.mapper';
import { ProjectDocumentRepo } from './project-document.repo';
import {
  ProjectDocumentCountQueryOptions,
  ProjectDocumentQueryOptions,
} from './project-document.zod';

@Injectable()
export class ProjectDocumentService {
  constructor(private repo: ProjectDocumentRepo) {}

  async getIds(opts?: ProjectDocumentQueryOptions) {
    return this.repo.getIds(opts);
  }

  async getCount(opts?: ProjectDocumentCountQueryOptions) {
    return this.repo.getCount(opts);
  }

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async save(projectDocument: ProjectDocument) {
    this._validate(projectDocument);

    if (!projectDocument.isPersist) {
      await this.repo.create(projectDocument);
    } else {
      await this.repo.update(projectDocument.id, projectDocument);
    }

    projectDocument.setPgState(ProjectDocumentMapper.toPg);
  }

  async saveBulk(projectDocuments: ProjectDocument[]) {
    return Promise.all(projectDocuments.map((p) => this.save(p)));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async deleteBulk(ids: string[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  private _validate(_projectDocument: ProjectDocument) {
    // validation rules can be added here
  }
}
