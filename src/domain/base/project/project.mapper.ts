import myDayjs from '@shared/common/common.dayjs';
import { toDate, toResponseDate } from '@shared/common/common.transformer';

import { Project } from './project.domain';
import type { ProjectResponse } from './project.response';
import type { ProjectJson, ProjectPg, ProjectPlain } from './project.type';

export function projectFromPg(pg: ProjectPg): Project {
  const plain: ProjectPlain = {
    id: pg.id,
    createdAt: myDayjs(pg.created_at).toDate(),
    updatedAt: myDayjs(pg.updated_at).toDate(),
    createdById: pg.created_by_id,
    updatedById: pg.updated_by_id,
    projectName: pg.project_name,
    projectDescription: pg.project_description,
    projectGuidelineMd: pg.project_guideline_md,
    projectStatus: pg.project_status,
    aiSummaryMd: pg.ai_summary_md,
  };

  return new Project(plain);
}

export function projectFromPgWithState(pg: ProjectPg): Project {
  return projectFromPg(pg).setPgState(projectToPg);
}

export function projectFromPlain(plainData: ProjectPlain): Project {
  const plain: ProjectPlain = {
    id: plainData.id,
    createdAt: plainData.createdAt,
    updatedAt: plainData.updatedAt,
    createdById: plainData.createdById,
    updatedById: plainData.updatedById,
    projectName: plainData.projectName,
    projectDescription: plainData.projectDescription,
    projectGuidelineMd: plainData.projectGuidelineMd,
    projectStatus: plainData.projectStatus,
    aiSummaryMd: plainData.aiSummaryMd,
  };

  return new Project(plain);
}

export function projectFromJson(json: ProjectJson): Project {
  const plain: ProjectPlain = {
    id: json.id,
    createdAt: toDate(json.createdAt),
    updatedAt: toDate(json.updatedAt),
    createdById: json.createdById,
    updatedById: json.updatedById,
    projectName: json.projectName,
    projectDescription: json.projectDescription,
    projectGuidelineMd: json.projectGuidelineMd,
    projectStatus: json.projectStatus,
    aiSummaryMd: json.aiSummaryMd,
  };

  return new Project(plain);
}

export function projectToPg(project: Project): ProjectPg {
  return {
    id: project.id,
    created_at: project.createdAt.toISOString(),
    updated_at: project.updatedAt.toISOString(),
    created_by_id: project.createdById,
    updated_by_id: project.updatedById,
    project_name: project.projectName,
    project_description: project.projectDescription,
    project_guideline_md: project.projectGuidelineMd,
    project_status: project.projectStatus,
    ai_summary_md: project.aiSummaryMd,
  };
}

export function projectToPlain(project: Project): ProjectPlain {
  return {
    id: project.id,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    createdById: project.createdById,
    updatedById: project.updatedById,
    projectName: project.projectName,
    projectDescription: project.projectDescription,
    projectGuidelineMd: project.projectGuidelineMd,
    projectStatus: project.projectStatus,
    aiSummaryMd: project.aiSummaryMd,
  };
}

export function projectToJson(project: Project): ProjectJson {
  return {
    id: project.id,
    createdAt: project.createdAt.toISOString(),
    createdById: project.createdById,
    updatedById: project.updatedById,
    updatedAt: project.updatedAt.toISOString(),
    projectName: project.projectName,
    projectDescription: project.projectDescription,
    projectGuidelineMd: project.projectGuidelineMd,
    projectStatus: project.projectStatus,
    aiSummaryMd: project.aiSummaryMd,
  };
}

export function projectToResponse(project: Project): ProjectResponse {
  return {
    id: project.id,
    createdAt: toResponseDate(project.createdAt),
    updatedAt: toResponseDate(project.updatedAt),
    projectName: project.projectName,
    projectDescription: project.projectDescription,
    projectGuidelineMd: project.projectGuidelineMd,
    projectStatus: project.projectStatus,
    aiSummaryMd: project.aiSummaryMd,
  };
}

export function projectPgToResponse(pg: ProjectPg): ProjectResponse {
  return {
    id: pg.id,
    createdAt: toResponseDate(pg.created_at),
    updatedAt: toResponseDate(pg.updated_at),
    projectName: pg.project_name,
    projectDescription: pg.project_description,
    projectGuidelineMd: pg.project_guideline_md,
    projectStatus: pg.project_status,
    aiSummaryMd: pg.ai_summary_md,
  };
}
