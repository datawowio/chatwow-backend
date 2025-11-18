import { uuidV7 } from '@shared/common/common.crypto';
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
  readonly documentStatus: 'ACTIVE' | 'INACTIVE';
  readonly aiSummaryMd: string;
  readonly projectId: string;

  constructor(plain: ProjectDocumentPlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: ProjectDocumentNewData) {
    return ProjectDocumentMapper.fromPlain({
      id: uuidV7(),
      projectId: data.projectId,
      documentStatus: data.documentStatus,
      aiSummaryMd: data.aiSummaryMd || '',
    });
  }

  static newBulk(data: ProjectDocumentNewData[]) {
    return data.map((d) => ProjectDocument.new(d));
  }

  edit(data: ProjectDocumentUpdateData) {
    const plain: ProjectDocumentPlain = {
      id: this.id,
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
