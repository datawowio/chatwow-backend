import type { DocumentStatus, ProjectDocuments } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { ProjectDocument } from './project-document.domain';

export type ProjectDocumentPg = DBModel<ProjectDocuments>;
export type ProjectDocumentPlain = Plain<ProjectDocument>;

export type ProjectDocumentJson = Serialized<ProjectDocumentPlain>;

export type ProjectDocumentNewData = {
  actorId: string | null;
  data: {
    documentStatus?: DocumentStatus;
    projectId: string;
    aiSummaryMd?: string;
    documentDetails?: string;
  };
};

export type ProjectDocumentUpdateData = {
  actorId?: string;
  data: {
    documentStatus?: DocumentStatus;
    aiSummaryMd?: string;
    projectId?: string;
    documentDetails?: string;
  };
};
