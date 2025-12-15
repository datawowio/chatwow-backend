import { toDate, toISO } from '@shared/common/common.transformer';

import { ProjectDocument } from './project-document.domain';
import type { ProjectDocumentResponse } from './project-document.response';
import type {
  ProjectDocumentJson,
  ProjectDocumentJsonWithState,
  ProjectDocumentPg,
  ProjectDocumentPlain,
} from './project-document.type';

export function projectDocumentFromPg(pg: ProjectDocumentPg): ProjectDocument {
  const plain: ProjectDocumentPlain = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
    createdById: pg.created_by_id,
    updatedById: pg.updated_by_id,
    projectId: pg.project_id,
    isRequireRegenerate: pg.is_require_regenerate,
    documentStatus: pg.document_status,
    documentDetails: pg.document_details,
    aiSummaryMd: pg.ai_summary_md,
  };

  return new ProjectDocument(plain);
}

export function projectDocumentFromPgWithState(
  pg: ProjectDocumentPg,
): ProjectDocument {
  return projectDocumentFromPg(pg).setPgState(projectDocumentToPg);
}

export function projectDocumentFromPlain(
  plainData: ProjectDocumentPlain,
): ProjectDocument {
  const plain: ProjectDocumentPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    updatedAt: plainData.updatedAt,
    createdById: plainData.createdById,
    isRequireRegenerate: plainData.isRequireRegenerate,
    updatedById: plainData.updatedById,
    projectId: plainData.projectId,
    documentDetails: plainData.documentDetails,
    documentStatus: plainData.documentStatus,
    aiSummaryMd: plainData.aiSummaryMd,
  };

  return new ProjectDocument(plain);
}

export function projectDocumentFromJson(
  json: ProjectDocumentJson,
): ProjectDocument {
  const plain: ProjectDocumentPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    updatedAt: toDate(json.updatedAt),
    createdById: json.createdById,
    isRequireRegenerate: json.isRequireRegenerate,
    updatedById: json.updatedById,
    projectId: json.projectId,
    documentStatus: json.documentStatus,
    documentDetails: json.documentDetails,
    aiSummaryMd: json.aiSummaryMd,
  };

  return new ProjectDocument(plain);
}
export function projectDocumentFromJsonState(
  jsonState: ProjectDocumentJsonWithState,
): ProjectDocument {
  const domain = projectDocumentFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function projectDocumentToPg(
  projectDocument: ProjectDocument,
): ProjectDocumentPg {
  return {
    id: projectDocument.id,
    created_at: toISO(projectDocument.createdAt),
    updated_at: toISO(projectDocument.updatedAt),
    created_by_id: projectDocument.createdById,
    is_require_regenerate: projectDocument.isRequireRegenerate,
    updated_by_id: projectDocument.updatedById,
    project_id: projectDocument.projectId,
    document_status: projectDocument.documentStatus,
    ai_summary_md: projectDocument.aiSummaryMd,
    document_details: projectDocument.documentDetails,
  };
}

export function projectDocumentToPlain(
  projectDocument: ProjectDocument,
): ProjectDocumentPlain {
  return {
    id: projectDocument.id,
    createdAt: projectDocument.createdAt,
    updatedAt: projectDocument.updatedAt,
    createdById: projectDocument.createdById,
    isRequireRegenerate: projectDocument.isRequireRegenerate,
    updatedById: projectDocument.updatedById,
    projectId: projectDocument.projectId,
    documentStatus: projectDocument.documentStatus,
    aiSummaryMd: projectDocument.aiSummaryMd,
    documentDetails: projectDocument.documentDetails,
  };
}

export function projectDocumentToJson(
  projectDocument: ProjectDocument,
): ProjectDocumentJson {
  return {
    id: projectDocument.id,
    createdAt: toISO(projectDocument.createdAt),
    updatedAt: toISO(projectDocument.updatedAt),
    createdById: projectDocument.createdById,
    isRequireRegenerate: projectDocument.isRequireRegenerate,
    updatedById: projectDocument.updatedById,
    projectId: projectDocument.projectId,
    documentStatus: projectDocument.documentStatus,
    aiSummaryMd: projectDocument.aiSummaryMd,
    documentDetails: projectDocument.documentDetails,
  };
}
export function projectDocumentToJsonState(
  domain: ProjectDocument,
): ProjectDocumentJsonWithState {
  return {
    state: domain.pgState,
    data: projectDocumentToJson(domain),
  };
}

export function projectDocumentToResponse(
  projectDocument: ProjectDocument,
): ProjectDocumentResponse {
  return {
    id: projectDocument.id,
    createdAt: toISO(projectDocument.createdAt),
    updatedAt: toISO(projectDocument.updatedAt),
    isRequireRegenerate: projectDocument.isRequireRegenerate,
    documentStatus: projectDocument.documentStatus,
    documentDetails: projectDocument.documentDetails,
    aiSummaryMd: projectDocument.aiSummaryMd,
  };
}

export function projectDocumentPgToResponse(
  pg: ProjectDocumentPg,
): ProjectDocumentResponse {
  return {
    id: pg.id,
    createdAt: toISO(pg.created_at),
    updatedAt: toISO(pg.updated_at),
    isRequireRegenerate: pg.is_require_regenerate,
    documentStatus: pg.document_status,
    documentDetails: pg.document_details,
    aiSummaryMd: pg.ai_summary_md,
  };
}
