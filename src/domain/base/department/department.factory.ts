import { faker } from '@faker-js/faker';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';

import { Department } from './department.domain';
import { departmentFromPlain } from './department.mapper';
import type { DepartmentNewData } from './department.type';

export function newDepartment(data: DepartmentNewData): Department {
  return departmentFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    departmentName: data.departmentName,
  });
}

export function newDepartments(data: DepartmentNewData[]): Department[] {
  return data.map((d) => newDepartment(d));
}

export function mockDepartment(overrides?: Partial<Department>): Department {
  return departmentFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    departmentName: faker.company.name(),
    ...overrides,
  });
}
