import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserGroupUserPg,
  UserGroupUserPlain,
  UserGroupUserUpdateData,
} from './user-group-user.type';

export class UserGroupUser extends DomainEntity<UserGroupUserPg> {
  readonly userId: string;
  readonly userGroupId: string;

  constructor(plain: UserGroupUserPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: UserGroupUserUpdateData) {
    const plain: UserGroupUserPlain = {
      userId: isDefined(data.userId) ? data.userId : this.userId,
      userGroupId: isDefined(data.userGroupId)
        ? data.userGroupId
        : this.userGroupId,
    };

    Object.assign(this, plain);
  }
}
