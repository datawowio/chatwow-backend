import type { ProjectStatus } from '@infra/db/db';

import { uuidV7 } from '@shared/common/common.crypto';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

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
  readonly currentProjectAiSummaryId: string | null;

  constructor(plain: ProjectPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: ProjectNewData) {
    return {
      id: uuidV7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      currentProjectAiSummaryId: data.currentProjectAiSummaryId || null,
      projectName: data.projectName,
      projectDescription: data.projectDescription || '',
      projectGuidelineMd: data.projectGuidelineMd || '',
      projectStatus: data.projectStatus,
    } as ProjectPlain;
  }

  static newBulk(data: ProjectNewData[]) {
    return data.map((d) => {
      const plain: ProjectPlain = Project.new(d);
      return new Project(plain);
    });
  }

  edit(data: ProjectUpdateData) {
    const plain: ProjectPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: new Date(),

      currentProjectAiSummaryId: isDefined(data.currentProjectAiSummaryId)
        ? data.currentProjectAiSummaryId
        : this.currentProjectAiSummaryId,
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
