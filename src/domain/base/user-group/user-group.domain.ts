import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  UserGroupNewData,
  UserGroupPg,
  UserGroupPlain,
  UserGroupUpdateData,
} from './types/user-group.domain.type';
import { UserGroupMapper } from './user-group.mapper';

export class UserGroup extends DomainEntity<UserGroupPg> {
  readonly id: string;
  readonly groupName: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(plain: UserGroupPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: UserGroupNewData) {
    return UserGroupMapper.fromPlain({
      id: uuidV7(),
      groupName: data.groupName,
      description: data.description || '',
      createdAt: myDayjs().toDate(),
      updatedAt: myDayjs().toDate(),
    });
  }

  static newBulk(data: UserGroupNewData[]) {
    return data.map((d) => UserGroup.new(d));
  }

  edit(data: UserGroupUpdateData) {
    const plain: UserGroupPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      groupName: isDefined(data.groupName) ? data.groupName : this.groupName,
      description: isDefined(data.description)
        ? data.description
        : this.description,
    };

    Object.assign(this, plain);
  }
}
