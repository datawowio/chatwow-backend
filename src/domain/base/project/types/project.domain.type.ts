import type { DBModel } from '@infra/db/db.common';
import type { Projects } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { Project } from '../project.domain';

export type ProjectPg = DBModel<Projects>;
export type ProjectPlain = Plain<Project>;

export type ProjectJson = Serialized<ProjectPlain>;

export type ProjectNewData = {
  projectName: string;
  projectDescription?: string;
  projectGuidelineMd?: string;
  projectStatus: 'ACTIVE' | 'INACTIVE';
  currentProjectAiSummaryId?: string;
};

export type ProjectUpdateData = {
  projectName?: string;
  projectDescription?: string;
  projectGuidelineMd?: string;
  projectStatus?: 'ACTIVE' | 'INACTIVE';
  currentProjectAiSummaryId?: string;
};
