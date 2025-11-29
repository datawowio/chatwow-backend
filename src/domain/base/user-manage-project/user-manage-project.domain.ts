import { DomainEntity } from '@shared/common/common.domain';

import type {
  UserManageProjectPg,
  UserManageProjectPlain,
} from './user-manage-project.type';

export class UserManageProject extends DomainEntity<UserManageProjectPg> {
  readonly createdAt: Date;
  readonly projectId: string;
  readonly userId: string;

  constructor(plain: UserManageProjectPlain) {
    super();
    Object.assign(this, plain);
  }
}
