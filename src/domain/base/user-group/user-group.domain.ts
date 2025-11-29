import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { userGroupFromPlain } from './user-group.mapper';
import type {
  UserGroupPg,
  UserGroupPlain,
  UserGroupUpdateData,
} from './user-group.type';

export class UserGroup extends DomainEntity<UserGroupPg> {
  readonly id: string;
  readonly groupName: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdById: string | null;
  readonly updatedById: string | null;

  constructor(plain: UserGroupPlain) {
    super();
    Object.assign(this, plain);
  }

  edit({ actorId, data }: UserGroupUpdateData) {
    const plain: UserGroupPlain = {
      id: this.id,
      createdAt: this.createdAt,
      createdById: this.createdById,
      updatedById: isDefined(actorId) ? actorId : this.updatedById,
      updatedAt: myDayjs().toDate(),
      groupName: isDefined(data.groupName) ? data.groupName : this.groupName,
      description: isDefined(data.description)
        ? data.description
        : this.description,
    };

    return userGroupFromPlain(plain);
  }
}
