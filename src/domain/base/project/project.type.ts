import type { Projects } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import type { Project } from './project.domain';

export type ProjectPg = DBModel<Projects>;
export type ProjectPlain = Plain<Project>;

export type ProjectJson = Serialized<ProjectPlain>;
export type ProjectJsonWithState = WithPgState<ProjectJson, ProjectPg>;

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
