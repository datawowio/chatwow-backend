import { toDate } from '@shared/common/common.transformer';

import { ProjectAISummary } from './project-ai-summary.domain';
import type {
  ProjectAISummaryJson,
  ProjectAISummaryPg,
  ProjectAISummaryPlain,
} from './types/project-ai-summary.domain.type';

export class ProjectAISummaryMapper {
  static fromPg(pg: ProjectAISummaryPg): ProjectAISummary {
    const plain: ProjectAISummaryPlain = {
      id: pg.id,
      projectId: pg.project_id,
      createdAt: toDate(pg.created_at),
      aiSummaryMd: pg.ai_summary_md,
    };

    return new ProjectAISummary(plain);
  }

  static fromPgWithState(pg: ProjectAISummaryPg): ProjectAISummary {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: ProjectAISummaryPlain): ProjectAISummary {
    const plain: ProjectAISummaryPlain = {
      id: plainData.id,
      projectId: plainData.projectId,
      createdAt: plainData.createdAt,
      aiSummaryMd: plainData.aiSummaryMd,
    };

    return new ProjectAISummary(plain);
  }

  static fromJson(json: ProjectAISummaryJson): ProjectAISummary {
    const plain: ProjectAISummaryPlain = {
      id: json.id,
      projectId: json.projectId,
      createdAt: toDate(json.createdAt),
      aiSummaryMd: json.aiSummaryMd,
    };

    return new ProjectAISummary(plain);
  }

  static toPg(projectAISummary: ProjectAISummary): ProjectAISummaryPg {
    return {
      id: projectAISummary.id,
      project_id: projectAISummary.projectId,
      created_at: projectAISummary.createdAt.toISOString(),
      ai_summary_md: projectAISummary.aiSummaryMd,
    };
  }

  static toPlain(projectAISummary: ProjectAISummary): ProjectAISummaryPlain {
    return {
      id: projectAISummary.id,
      projectId: projectAISummary.projectId,
      createdAt: projectAISummary.createdAt,
      aiSummaryMd: projectAISummary.aiSummaryMd,
    };
  }

  static toJson(projectAISummary: ProjectAISummary): ProjectAISummaryJson {
    return {
      id: projectAISummary.id,
      projectId: projectAISummary.projectId,
      createdAt: projectAISummary.createdAt.toISOString(),
      aiSummaryMd: projectAISummary.aiSummaryMd,
    };
  }

  static toResponse(projectAISummary: ProjectAISummary) {
    return {
      id: projectAISummary.id,
      createdAt: projectAISummary.createdAt?.toISOString() || null,
      aiSummaryMd: projectAISummary.aiSummaryMd,
    };
  }
}
