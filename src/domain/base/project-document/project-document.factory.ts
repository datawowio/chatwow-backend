import type { SetRequired } from 'type-fest';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { ProjectDocument } from './project-document.domain';
import { projectDocumentFromPlain } from './project-document.mapper';
import type {
  ProjectDocumentNewData,
  ProjectDocumentPlain,
} from './project-document.type';

export function newProjectDocument({
  actorId,
  data,
}: ProjectDocumentNewData): ProjectDocument {
  return projectDocumentFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    createdById: actorId,
    updatedById: actorId,
    projectId: data.projectId,
    isRequireRegenerate: false,
    updatedAt: myDayjs().toDate(),
    documentDetails: data.documentDetails || '',
    documentStatus: valueOr(data.documentStatus, 'PROCESSING'),
    aiSummaryMd: data.aiSummaryMd || '',
    hasUpdatedAiMemory: true,
  });
}

export function newProjectDocuments(
  data: ProjectDocumentNewData[],
): ProjectDocument[] {
  return data.map((d) => newProjectDocument(d));
}

export function mockProjectDocument(
  data: SetRequired<Partial<ProjectDocumentPlain>, 'projectId'>,
): ProjectDocument {
  return projectDocumentFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    isRequireRegenerate: isDefined(data.isRequireRegenerate)
      ? data.isRequireRegenerate
      : false,
    documentStatus: isDefined(data.documentStatus)
      ? data.documentStatus
      : 'ACTIVE',
    documentDetails: isDefined(data.documentDetails)
      ? data.documentDetails
      : '',
    projectId: data.projectId,
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    aiSummaryMd: isDefined(data.aiSummaryMd) ? data.aiSummaryMd : '',
    createdById: isDefined(data.createdById) ? data.createdById : null,
    updatedById: isDefined(data.updatedById) ? data.updatedById : null,
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : myDayjs().toDate(),
    hasUpdatedAiMemory: true,
  });
}

export function mockProjectDocuments(
  amount: number,
  data: SetRequired<Partial<ProjectDocumentPlain>, 'projectId'>,
): ProjectDocument[] {
  return Array(amount)
    .fill(0)
    .map(() => mockProjectDocument(data));
}
