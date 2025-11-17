import { uuidV7 } from '@shared/common/common.crypto';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserGroupProjectNewData,
  UserGroupProjectPg,
  UserGroupProjectPlain,
  UserGroupProjectUpdateData,
} from './types/user-group-project.domain.type';
import { UserGroupProjectMapper } from './user-group-project.mapper';

export class UserGroupProject extends DomainEntity<UserGroupProjectPg> {
  readonly id: string;
  readonly projectId: string;
  readonly userGroupId: string;

  constructor(plain: UserGroupProjectPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: UserGroupProjectNewData) {
    return UserGroupProjectMapper.fromPlain({
      id: uuidV7(),
      projectId: data.projectId,
      userGroupId: data.userGroupId,
    });
  }

  static newBulk(data: UserGroupProjectNewData[]) {
    return data.map((d) => {
      const plain: UserGroupProjectPlain = UserGroupProject.new(d);
      return new UserGroupProject(plain);
    });
  }

  edit(data: UserGroupProjectUpdateData) {
    const plain: UserGroupProjectPlain = {
      id: this.id,
      projectId: isDefined(data.projectId) ? data.projectId : this.projectId,
      userGroupId: isDefined(data.userGroupId)
        ? data.userGroupId
        : this.userGroupId,
    };

    Object.assign(this, plain);
  }
}
