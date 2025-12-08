import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserGroupProjectPg,
  UserGroupProjectPlain,
  UserGroupProjectUpdateData,
} from './user-group-project.type';

export class UserGroupProject extends DomainEntity<UserGroupProjectPg> {
  readonly projectId: string;
  readonly userGroupId: string;

  constructor(plain: UserGroupProjectPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: UserGroupProjectUpdateData) {
    const plain: UserGroupProjectPlain = {
      projectId: isDefined(data.projectId) ? data.projectId : this.projectId,
      userGroupId: isDefined(data.userGroupId)
        ? data.userGroupId
        : this.userGroupId,
    };

    Object.assign(this, plain);
  }
}
