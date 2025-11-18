import type { ProjectStatus } from '@infra/db/db';

import { uuidV7 } from '@shared/common/common.crypto';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { ProjectMapper } from './project.mapper';
import type {
  ProjectNewData,
  ProjectPg,
  ProjectPlain,
  ProjectUpdateData,
} from './types/project.domain.type';

export class Project extends DomainEntity<ProjectPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly projectName: string;
  readonly projectDescription: string;
  readonly projectGuidelineMd: string;
  readonly projectStatus: ProjectStatus;
  readonly aiSummaryMd: string;

  constructor(plain: ProjectPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: ProjectNewData) {
    return ProjectMapper.fromPlain({
      id: uuidV7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      projectName: data.projectName,
      projectDescription: data.projectDescription || '',
      projectGuidelineMd: data.projectGuidelineMd || '',
      projectStatus: data.projectStatus,
      aiSummaryMd: isDefined(data.aiSummaryMd) ? data.aiSummaryMd : '',
    });
  }

  static newBulk(data: ProjectNewData[]) {
    return data.map((d) => Project.new(d));
  }

  edit(data: ProjectUpdateData) {
    const plain: ProjectPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: new Date(),

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

    Object.assign(this, plain);
  }
}
