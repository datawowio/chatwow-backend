import type { DBModel } from '@infra/db/db.common';
import type { ProjectAiSummaries } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { ProjectAISummary } from '../project-ai-summary.domain';

export type ProjectAISummaryPg = DBModel<ProjectAiSummaries>;
export type ProjectAISummaryPlain = Plain<ProjectAISummary>;

export type ProjectAISummaryJson = Serialized<ProjectAISummaryPlain>;

export type ProjectAISummaryNewData = {
  projectId: string;
  aiSummaryMd?: string;
};

export type ProjectAISummaryUpdateData = {
  projectId?: string;
  aiSummaryMd?: string;
};
