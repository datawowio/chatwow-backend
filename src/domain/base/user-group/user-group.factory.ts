import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { isDefined } from '@shared/common/common.validator';

import type { UserGroupPlain } from './types/user-group.domain.type';
import { UserGroupMapper } from './user-group.mapper';

export class UserGroupFactory {
  static mock(data: Partial<UserGroupPlain>) {
    return UserGroupMapper.fromPlain({
      id: isDefined(data.id) ? data.id : uuidV7(),
      groupName: isDefined(data.groupName) ? data.groupName : 'Test Group',
      description: isDefined(data.description) ? data.description : '',
      createdAt: isDefined(data.createdAt)
        ? data.createdAt
        : myDayjs().toDate(),
      updatedAt: isDefined(data.updatedAt)
        ? data.updatedAt
        : myDayjs().toDate(),
    });
  }

  static mockBulk(amount: number, data: Partial<UserGroupPlain>) {
    return Array(amount)
      .fill(0)
      .map(() => this.mock(data));
  }
}
