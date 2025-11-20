import type { DBModel } from '@infra/db/db.common';
import type { DocumentStatus, ProjectDocuments } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { ProjectDocument } from '../project-document.domain';

export type ProjectDocumentPg = DBModel<ProjectDocuments>;
export type ProjectDocumentPlain = Plain<ProjectDocument>;

export type ProjectDocumentJson = Serialized<ProjectDocumentPlain>;

export type ProjectDocumentNewData = {
  documentStatus: DocumentStatus;
  projectId: string;
  aiSummaryMd?: string;
  documentDetails?: string;
};

export type ProjectDocumentUpdateData = {
  documentStatus?: DocumentStatus;
  aiSummaryMd?: string;
  projectId?: string;
  documentDetails?: string;
};
