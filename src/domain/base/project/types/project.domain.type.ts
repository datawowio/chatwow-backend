import type { DBModel } from '@infra/db/db.common';
import type { Projects } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { Project } from '../project.domain';

export type ProjectPg = DBModel<Projects>;
export type ProjectPlain = Plain<Project>;

export type ProjectJson = Serialized<ProjectPlain>;

export type ProjectNewData = {
  actorId: string | null;
  data: {
    projectName: string;
    projectDescription?: string;
    projectGuidelineMd?: string;
    projectStatus: 'ACTIVE' | 'INACTIVE';
    aiSummaryMd?: string;
  };
};

export type ProjectUpdateData = {
  actorId?: string;
  data: {
    projectName?: string;
    projectDescription?: string;
    projectGuidelineMd?: string;
    projectStatus?: 'ACTIVE' | 'INACTIVE';
    aiSummaryMd?: string;
  };
};
