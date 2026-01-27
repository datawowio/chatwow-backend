import type { Departments } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { Department } from './department.domain';

export type DepartmentPg = DBModel<Departments>;
export type DepartmentPlain = Plain<Department>;
export type DepartmentJson = Serialized<DepartmentPlain>;

export type DepartmentNewData = {
  departmentName: string;
};

export type DepartmentUpdateData = {
  departmentName?: string;
};
