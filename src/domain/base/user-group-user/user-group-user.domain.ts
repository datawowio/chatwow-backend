import { uuidV7 } from '@shared/common/common.crypto';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserGroupUserNewData,
  UserGroupUserPg,
  UserGroupUserPlain,
  UserGroupUserUpdateData,
} from './types/user-group-user.domain.type';

export class UserGroupUser extends DomainEntity<UserGroupUserPg> {
  readonly id: string;
  readonly userId: string;
  readonly userGroupId: string;

  constructor(plain: UserGroupUserPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: UserGroupUserNewData) {
    return {
      id: uuidV7(),
      userId: data.userId || null,
      userGroupId: data.userGroupId || null,
    } as UserGroupUserPlain;
  }

  static newBulk(data: UserGroupUserNewData[]) {
    return data.map((d) => {
      const plain: UserGroupUserPlain = UserGroupUser.new(d);
      return new UserGroupUser(plain);
    });
  }

  edit(data: UserGroupUserUpdateData) {
    const plain: UserGroupUserPlain = {
      id: this.id,
      userId: isDefined(data.userId) ? data.userId : this.userId,
      userGroupId: isDefined(data.userGroupId)
        ? data.userGroupId
        : this.userGroupId,
    };

    Object.assign(this, plain);
  }
}
