import type { SetRequired } from 'type-fest';

import { uuidV7 } from '@shared/common/common.crypto';
import { isDefined } from '@shared/common/common.validator';

import { ProjectDocumentMapper } from './project-document.mapper';
import type { ProjectDocumentPlain } from './types/project-document.domain.type';

export class ProjectDocumentFactory {
  static mock(data: SetRequired<Partial<ProjectDocumentPlain>, 'projectId'>) {
    return ProjectDocumentMapper.fromPlain({
      id: isDefined(data.id) ? data.id : uuidV7(),
      documentStatus: isDefined(data.documentStatus)
        ? data.documentStatus
        : 'ACTIVE',
      documentDetails: isDefined(data.documentDetails)
        ? data.documentDetails
        : '',
      projectId: data.projectId,
      aiSummaryMd: isDefined(data.aiSummaryMd) ? data.aiSummaryMd : '',
    });
  }

  static mockBulk(
    amount: number,
    data: SetRequired<Partial<ProjectDocumentPlain>, 'projectId'>,
  ) {
    return Array(amount)
      .fill(0)
      .map(() => this.mock(data));
  }
}
