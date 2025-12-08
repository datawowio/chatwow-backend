import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserGroupManagerPg,
  UserGroupManagerPlain,
  UserGroupManagerUpdateData,
} from './user-group-manager.type';

export class UserGroupManager extends DomainEntity<UserGroupManagerPg> {
  readonly userId: string;
  readonly userGroupId: string;

  constructor(plain: UserGroupManagerPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: UserGroupManagerUpdateData) {
    const plain: UserGroupManagerPlain = {
      userId: isDefined(data.userId) ? data.userId : this.userId,
      userGroupId: isDefined(data.userGroupId)
        ? data.userGroupId
        : this.userGroupId,
    };

    Object.assign(this, plain);
  }
}
