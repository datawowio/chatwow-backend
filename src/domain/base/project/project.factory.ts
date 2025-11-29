import { uuidV7 } from '@shared/common/common.crypto';
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
    projectStatus: data.projectStatus,
    aiSummaryMd: isDefined(data.aiSummaryMd) ? data.aiSummaryMd : '',
  });
}

export function newProjects(data: ProjectNewData[]): Project[] {
  return data.map((d) => newProject(d));
}

export function mockProject(data: Partial<ProjectPlain>): Project {
  return projectFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : new Date(),
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : new Date(),
    projectName: isDefined(data.projectName)
      ? data.projectName
      : 'Test Project',
    projectDescription: isDefined(data.projectDescription)
      ? data.projectDescription
      : '',
    projectGuidelineMd: isDefined(data.projectGuidelineMd)
      ? data.projectGuidelineMd
      : '',
    projectStatus: isDefined(data.projectStatus)
      ? data.projectStatus
      : 'ACTIVE',
    aiSummaryMd: isDefined(data.aiSummaryMd) ? data.aiSummaryMd : '',
    createdById: isDefined(data.createdById) ? data.createdById : null,
    updatedById: isDefined(data.updatedById) ? data.updatedById : null,
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
