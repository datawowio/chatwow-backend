import { Injectable } from '@nestjs/common';

import { UserGroupProjectRepo } from './user-group-project.repo';

@Injectable()
export class UserGroupProjectService {
  constructor(private repo: UserGroupProjectRepo) {}

  async saveUserRelations(userGroupId: string, projectIds: string[]) {
    return this.repo.saveUserGroupRelations(userGroupId, projectIds);
  }

  async saveProjectRelations(projectId: string, userGroupIds: string[]) {
    return this.repo.saveProjectRelations(projectId, userGroupIds);
  }
}
