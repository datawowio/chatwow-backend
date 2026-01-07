import type { AiUsageAction, AiUsages } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import { AiUsageRefTable } from './ai-usage.constant';
import type { AiUsage } from './ai-usage.domain';

export type AiUsagePg = DBModel<AiUsages>;
export type AiUsagePlain = Plain<AiUsage>;

export type AiUsageJson = Serialized<AiUsagePlain>;

export type AiUsageNewData = {
  userId: string;
  projectId: string;
  refTable: AiUsageRefTable;
  refId: string;
  aiUsageAction: AiUsageAction;
};

export type AiUsageStopRecordData = {
  tokenUsed: number;
  confidence: number;
};

export type AiUsageSaveOpts = {
  disableEvent?: boolean;
};
