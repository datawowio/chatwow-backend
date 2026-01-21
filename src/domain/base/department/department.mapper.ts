import { toDate, toISO } from '@shared/common/common.transformer';

import { Department } from './department.domain';
import type { DepartmentResponse } from './department.response';
import type { DepartmentPg, DepartmentPlain } from './department.type';

export function departmentFromPg(pg: DepartmentPg): Department {
  const plain: DepartmentPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
    departmentName: pg.department_name,
  };
  return new Department(plain);
}

export function departmentFromPgWithState(pg: DepartmentPg): Department {
  return departmentFromPg(pg).setPgState(departmentToPg);
}

export function departmentFromPlain(plain: DepartmentPlain): Department {
  return new Department({
    id: plain.id,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
    departmentName: plain.departmentName,
  });
}

export function departmentToPg(department: Department): DepartmentPg {
  return {
    id: department.id,
    created_at: toISO(department.createdAt),
    updated_at: toISO(department.updatedAt),
    department_name: department.departmentName,
  };
}

export function departmentToPlain(department: Department): DepartmentPlain {
  return {
    id: department.id,
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
    departmentName: department.departmentName,
  };
}

export function departmentToResponse(
  department: Department,
): DepartmentResponse {
  return {
    id: department.id,
    createdAt: toISO(department.createdAt),
    updatedAt: toISO(department.updatedAt),
    departmentName: department.departmentName,
  };
}

export function departmentPgToResponse(pg: DepartmentPg): DepartmentResponse {
  return {
    id: pg.id,
    createdAt: toISO(pg.created_at),
    updatedAt: toISO(pg.updated_at),
    departmentName: pg.department_name,
  };
}
