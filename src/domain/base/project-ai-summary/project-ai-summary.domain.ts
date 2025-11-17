import { uuidV7 } from '@shared/common/common.crypto';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  ProjectAISummaryNewData,
  ProjectAISummaryPg,
  ProjectAISummaryPlain,
  ProjectAISummaryUpdateData,
} from './types/project-ai-summary.domain.type';

export class ProjectAISummary extends DomainEntity<ProjectAISummaryPg> {
  readonly id: string;
  readonly projectId: string;
  readonly createdAt: Date;
  readonly aiSummaryMd: string;

  constructor(plain: ProjectAISummaryPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: ProjectAISummaryNewData) {
    return {
      id: uuidV7(),
      createdAt: new Date(),
      aiSummaryMd: data.aiSummaryMd || '',
    } as ProjectAISummaryPlain;
  }

  static newBulk(data: ProjectAISummaryNewData[]) {
    return data.map((d) => {
      const plain: ProjectAISummaryPlain = ProjectAISummary.new(d);
      return new ProjectAISummary(plain);
    });
  }

  edit(data: ProjectAISummaryUpdateData) {
    const plain: ProjectAISummaryPlain = {
      id: this.id,
      createdAt: this.createdAt,

      // update
      projectId: isDefined(data.projectId) ? data.projectId : this.projectId,
      aiSummaryMd: isDefined(data.aiSummaryMd)
        ? data.aiSummaryMd
        : this.aiSummaryMd,
    };

    Object.assign(this, plain);
  }
}
