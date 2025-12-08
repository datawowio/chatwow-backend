import { faker } from '@faker-js/faker';

import { uuidV7 } from '@shared/common/common.crypto';
import { firstValueOr, valueOr } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { Project } from './project.domain';
import { projectFromPlain } from './project.mapper';
import type { ProjectNewData, ProjectPlain } from './project.type';

export function newProject({ actorId, data }: ProjectNewData): Project {
  return projectFromPlain({
    id: uuidV7(),
    createdAt: new Date(),
    createdById: actorId,
    updatedById: actorId,
    updatedAt: new Date(),
    projectName: data.projectName,
    projectDescription: data.projectDescription || '',
    projectGuidelineMd: data.projectGuidelineMd || '',
    projectStatus: valueOr(data.projectStatus, 'PROCESSING'),
    aiSummaryMd: isDefined(data.aiSummaryMd) ? data.aiSummaryMd : '',
  });
}

export function newProjects(data: ProjectNewData[]): Project[] {
  return data.map((d) => newProject(d));
}

export function mockProject(data: Partial<ProjectPlain>): Project {
  return projectFromPlain({
    id: valueOr(data.id, uuidV7()),
    createdAt: valueOr(data.createdAt, new Date()),
    updatedAt: valueOr(data.updatedAt, new Date()),
    projectName: valueOr(data.projectName, faker.commerce.productName()),
    projectDescription: valueOr(
      data.projectDescription,
      faker.commerce.productDescription(),
    ),
    projectGuidelineMd: valueOr(data.projectGuidelineMd, ''),
    projectStatus: valueOr(data.projectStatus, 'ACTIVE'),
    aiSummaryMd: valueOr(data.aiSummaryMd, ''),
    createdById: valueOr(data.createdById, null),
    updatedById: firstValueOr([data.updatedById, data.createdById], null),
  });
}

export function mockProjects(
  amount: number,
  data: Partial<ProjectPlain>,
): Project[] {
  return Array(amount)
    .fill(0)
    .map(() => mockProject(data));
}
