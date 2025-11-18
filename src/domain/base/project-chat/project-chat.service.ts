import { Injectable } from '@nestjs/common';

import { ProjectChat } from './project-chat.domain';
import { ProjectChatMapper } from './project-chat.mapper';
import { ProjectChatRepo } from './project-chat.repo';

@Injectable()
export class ProjectChatService {
  constructor(private readonly repo: ProjectChatRepo) {}

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async save(projectChat: ProjectChat) {
    this._validate(projectChat);

    if (!projectChat.isPersist) {
      await this.repo.create(projectChat);
    } else {
      await this.repo.update(projectChat.id, projectChat);
    }

    projectChat.setPgState(ProjectChatMapper.toPg);
  }

  async saveBulk(lineSessions: ProjectChat[]) {
    return Promise.all(lineSessions.map((u) => this.save(u)));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  private _validate(_lineSession: ProjectChat) {
    // validation rules can be added here
  }
}
