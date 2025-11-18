import { Injectable } from '@nestjs/common';

import { diff } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';

import { ProjectChat } from './project-chat.domain';
import { ProjectChatMapper } from './project-chat.mapper';

@Injectable()
export class ProjectChatRepo extends BaseRepo {
  async create(domain: ProjectChat): Promise<void> {
    await this.db
      //
      .insertInto('project_chats')
      .values(ProjectChatMapper.toPg(domain))
      .execute();
  }

  async update(id: string, domain: ProjectChat): Promise<void> {
    const data = diff(domain.pgState, ProjectChatMapper.toPg(domain));
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('project_chats')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<ProjectChat | null> {
    const userPg = await this.readDb
      .selectFrom('project_chats')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!userPg) {
      return null;
    }

    const domain = ProjectChatMapper.fromPgWithState(userPg);
    return domain;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('project_chats')
      .where('id', '=', id)
      .execute();
  }
}
