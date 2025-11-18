import myDayjs from '@shared/common/common.dayjs';
import { toDate } from '@shared/common/common.transformer';

import { Project } from './project.domain';
import type { ProjectResponse } from './project.response';
import type {
  ProjectJson,
  ProjectPg,
  ProjectPlain,
} from './types/project.domain.type';

export class ProjectMapper {
  static fromPg(pg: ProjectPg): Project {
    const plain: ProjectPlain = {
      id: pg.id,
      createdAt: myDayjs(pg.created_at).toDate(),
      updatedAt: myDayjs(pg.updated_at).toDate(),
      projectName: pg.project_name,
      projectDescription: pg.project_description,
      projectGuidelineMd: pg.project_guideline_md,
      projectStatus: pg.project_status,
      aiSummaryMd: pg.ai_summary_md,
    };

    return new Project(plain);
  }

  static fromPgWithState(pg: ProjectPg): Project {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: ProjectPlain): Project {
    const plain: ProjectPlain = {
      id: plainData.id,
      createdAt: plainData.createdAt,
      updatedAt: plainData.updatedAt,
      projectName: plainData.projectName,
      projectDescription: plainData.projectDescription,
      projectGuidelineMd: plainData.projectGuidelineMd,
      projectStatus: plainData.projectStatus,
      aiSummaryMd: plainData.aiSummaryMd,
    };

    return new Project(plain);
  }

  static fromJson(json: ProjectJson): Project {
    const plain: ProjectPlain = {
      id: json.id,
      createdAt: toDate(json.createdAt),
      updatedAt: toDate(json.updatedAt),
      projectName: json.projectName,
      projectDescription: json.projectDescription,
      projectGuidelineMd: json.projectGuidelineMd,
      projectStatus: json.projectStatus,
      aiSummaryMd: json.aiSummaryMd,
    };

    return new Project(plain);
  }

  static toPg(project: Project): ProjectPg {
    return {
      id: project.id,
      created_at: project.createdAt.toISOString(),
      updated_at: project.updatedAt.toISOString(),
      project_name: project.projectName,
      project_description: project.projectDescription,
      project_guideline_md: project.projectGuidelineMd,
      project_status: project.projectStatus,
      ai_summary_md: project.aiSummaryMd,
    };
  }

  static toPlain(project: Project): ProjectPlain {
    return {
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      projectGuidelineMd: project.projectGuidelineMd,
      projectStatus: project.projectStatus,
      aiSummaryMd: project.aiSummaryMd,
    };
  }

  static toJson(project: Project): ProjectJson {
    return {
      id: project.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      projectGuidelineMd: project.projectGuidelineMd,
      projectStatus: project.projectStatus,
      aiSummaryMd: project.aiSummaryMd,
    };
  }

  static toResponse(project: Project): ProjectResponse {
    return {
      id: project.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      projectName: project.projectName,
      projectDescription: project.projectDescription,
      projectGuidelineMd: project.projectGuidelineMd,
      projectStatus: project.projectStatus,
      aiSummaryMd: project.aiSummaryMd,
    };
  }
}
