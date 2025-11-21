import type { DocumentStatus } from '@infra/db/db';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { ProjectDocumentMapper } from './project-document.mapper';
import type {
  ProjectDocumentNewData,
  ProjectDocumentPg,
  ProjectDocumentPlain,
  ProjectDocumentUpdateData,
} from './types/project-document.domain.type';

export class ProjectDocument extends DomainEntity<ProjectDocumentPg> {
  readonly id: string;
  readonly documentStatus: DocumentStatus;
  readonly documentDetails: string;
  readonly aiSummaryMd: string;
  readonly projectId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdById: string | null;
  readonly updatedById: string | null;

  constructor(plain: ProjectDocumentPlain) {
    super();
    Object.assign(this, plain);
  }

  static new({ actorId, data }: ProjectDocumentNewData) {
    return ProjectDocumentMapper.fromPlain({
      id: uuidV7(),
      createdAt: myDayjs().toDate(),
      createdById: actorId,
      updatedById: actorId,
      projectId: data.projectId,
      updatedAt: myDayjs().toDate(),
      documentDetails: data.documentDetails || '',
      documentStatus: data.documentStatus || 'ACTIVE',
      aiSummaryMd: data.aiSummaryMd || '',
    });
  }

  static newBulk(data: ProjectDocumentNewData[]) {
    return data.map((d) => ProjectDocument.new(d));
  }

  edit({ actorId, data }: ProjectDocumentUpdateData) {
    const plain: ProjectDocumentPlain = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      createdById: this.createdById,
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
}
