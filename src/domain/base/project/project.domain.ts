import type { ProjectStatus } from '@infra/db/db';

import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { projectFromPlain, projectToPlain } from './project.mapper';
import type {
  ProjectPg,
  ProjectPlain,
  ProjectUpdateData,
} from './project.type';

export class Project extends DomainEntity<ProjectPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly projectName: string;
  readonly projectDescription: string;
  readonly projectGuidelineMd: string;
  readonly projectStatus: ProjectStatus;
  readonly aiSummaryMd: string;

  readonly createdById: string | null;
  readonly updatedById: string | null;

  constructor(plain: ProjectPlain) {
    super();
    Object.assign(this, plain);
  }

  edit({ actorId, data }: ProjectUpdateData) {
    const plain: ProjectPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      createdById: this.createdById,
      updatedById: isDefined(actorId) ? actorId : this.updatedById,

      aiSummaryMd: isDefined(data.aiSummaryMd)
        ? data.aiSummaryMd
        : this.aiSummaryMd,
      projectName: isDefined(data.projectName)
        ? data.projectName
        : this.projectName,
      projectDescription: isDefined(data.projectDescription)
        ? data.projectDescription
        : this.projectDescription,
      projectGuidelineMd: isDefined(data.projectGuidelineMd)
        ? data.projectGuidelineMd
        : this.projectGuidelineMd,
      projectStatus: isDefined(data.projectStatus)
        ? data.projectStatus
        : this.projectStatus,
    };

    return projectFromPlain(plain);
  }

  clone() {
    return projectFromPlain(projectToPlain(this));
  }
}
