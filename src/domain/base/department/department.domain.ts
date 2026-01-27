import { DomainEntity } from '@shared/common/common.domain';
import { valueOr } from '@shared/common/common.func';

import type {
  DepartmentPg,
  DepartmentPlain,
  DepartmentUpdateData,
} from './department.type';

export class Department extends DomainEntity<DepartmentPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly departmentName: string;

  constructor(plain: DepartmentPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: DepartmentUpdateData) {
    const plain: DepartmentPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: new Date(),

      // update data
      departmentName: valueOr(data.departmentName, this.departmentName),
    };

    Object.assign(this, plain);
  }
}
