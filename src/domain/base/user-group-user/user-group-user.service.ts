import { Injectable } from '@nestjs/common';

import { UserGroupUserRepo } from './user-group-user.repo';

@Injectable()
export class UserGroupUserService {
  constructor(private repo: UserGroupUserRepo) {}

  async saveUserRelations(userGroupId: string, projectIds: string[]) {
    return this.repo.saveUserRelations(userGroupId, projectIds);
  }

  async saveProjectRelations(projectId: string, userGroupIds: string[]) {
    return this.repo.saveProjectRelations(projectId, userGroupIds);
  }
}
