import { uuidV7 } from '@shared/common/common.crypto';
import { isDefined } from '@shared/common/common.validator';

import { ProjectMapper } from './project.mapper';
import type { ProjectPlain } from './types/project.domain.type';

export class ProjectFactory {
  static mock(data: Partial<ProjectPlain>) {
    return ProjectMapper.fromPlain({
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

  static mockBulk(amount: number, data: Partial<ProjectPlain>) {
    return Array(amount)
      .fill(0)
      .map(() => this.mock(data));
  }
}
