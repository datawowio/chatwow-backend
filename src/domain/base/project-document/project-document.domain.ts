import type { DocumentStatus } from '@infra/db/db';

import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import {
  projectDocumentFromPlain,
  projectDocumentToPlain,
} from './project-document.mapper';
import type {
  ProjectDocumentPg,
  ProjectDocumentPlain,
  ProjectDocumentUpdateData,
} from './project-document.type';

export class ProjectDocument extends DomainEntity<ProjectDocumentPg> {
  readonly id: string;
  readonly documentStatus: DocumentStatus;
  readonly documentDetails: string;
  readonly aiSummaryMd: string;
  readonly projectId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isRequireRegenerate: boolean;
  readonly createdById: string | null;
  readonly updatedById: string | null;

  readonly hasUpdatedAiMemory: boolean;

  constructor(plain: ProjectDocumentPlain) {
    super();
    Object.assign(this, plain);
  }

  edit({ actorId, data }: ProjectDocumentUpdateData) {
    const aiSummaryUpdated = isDefined(data.aiSummaryMd)
      ? data.aiSummaryMd != this.aiSummaryMd
      : false;

    const descriptionUpdated = isDefined(data.documentDetails)
      ? data.documentDetails != this.documentDetails
      : false;

    const statusUpdated = isDefined(data.documentStatus)
      ? data.documentStatus != this.documentStatus
      : this.hasUpdatedAiMemory;

    const plain: ProjectDocumentPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      createdById: this.createdById,
      hasUpdatedAiMemory:
        aiSummaryUpdated || descriptionUpdated || statusUpdated,

      isRequireRegenerate: isDefined(data.isRequireRegenerate)
        ? data.isRequireRegenerate
        : descriptionUpdated,
      updatedById: isDefined(actorId) ? actorId : this.updatedById,
      documentDetails: isDefined(data.documentDetails)
        ? data.documentDetails
        : this.documentDetails,
      documentStatus: isDefined(data.documentStatus)
        ? data.documentStatus
        : this.documentStatus,
      aiSummaryMd: isDefined(data.aiSummaryMd)
        ? data.aiSummaryMd
        : this.aiSummaryMd,
      projectId: isDefined(data.projectId) ? data.projectId : this.projectId,
    };

    Object.assign(this, plain);
  }

  clone() {
    return projectDocumentFromPlain(projectDocumentToPlain(this));
  }
}
