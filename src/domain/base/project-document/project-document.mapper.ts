import { ProjectDocument } from './project-document.domain';
import type {
  ProjectDocumentJson,
  ProjectDocumentPg,
  ProjectDocumentPlain,
} from './types/project-document.domain.type';

export class ProjectDocumentMapper {
  static fromPg(pg: ProjectDocumentPg): ProjectDocument {
    const plain: ProjectDocumentPlain = {
      id: pg.id,
      projectId: pg.project_id,
      documentStatus: pg.document_status,
      aiSummaryMd: pg.ai_summary_md,
    };

    return new ProjectDocument(plain);
  }

  static fromPgWithState(pg: ProjectDocumentPg): ProjectDocument {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: ProjectDocumentPlain): ProjectDocument {
    const plain: ProjectDocumentPlain = {
      id: plainData.id,
      projectId: plainData.projectId,
      documentStatus: plainData.documentStatus,
      aiSummaryMd: plainData.aiSummaryMd,
    };

    return new ProjectDocument(plain);
  }

  static fromJson(json: ProjectDocumentJson): ProjectDocument {
    const plain: ProjectDocumentPlain = {
      id: json.id,
      projectId: json.projectId,
      documentStatus: json.documentStatus,
      aiSummaryMd: json.aiSummaryMd,
    };

    return new ProjectDocument(plain);
  }

  static toPg(projectDocument: ProjectDocument): ProjectDocumentPg {
    return {
      id: projectDocument.id,
      project_id: projectDocument.projectId,
      document_status: projectDocument.documentStatus,
      ai_summary_md: projectDocument.aiSummaryMd,
    };
  }

  static toPlain(projectDocument: ProjectDocument): ProjectDocumentPlain {
    return {
      id: projectDocument.id,
      projectId: projectDocument.projectId,
      documentStatus: projectDocument.documentStatus,
      aiSummaryMd: projectDocument.aiSummaryMd,
    };
  }

  static toJson(projectDocument: ProjectDocument): ProjectDocumentJson {
    return {
      id: projectDocument.id,
      projectId: projectDocument.projectId,
      documentStatus: projectDocument.documentStatus,
      aiSummaryMd: projectDocument.aiSummaryMd,
    };
  }

  static toResponse(projectDocument: ProjectDocument) {
    return {
      id: projectDocument.id,
      documentStatus: projectDocument.documentStatus,
      aiSummaryMd: projectDocument.aiSummaryMd,
    };
  }
}
