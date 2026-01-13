import type { AiModelName, AiUsageAction, AiUsages } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import { AiUsageRefTable } from './ai-usage.constant';
import type { AiUsage } from './ai-usage.domain';

export type AiUsagePg = DBModel<AiUsages>;
export type AiUsagePlain = Plain<AiUsage>;

export type AiUsageJson = Serialized<AiUsagePlain>;
export type AiUsageJsonState = WithPgState<AiUsageJson, AiUsagePg>;

export type AiUsageNewData = {
  actorId?: string | null;
  data: {
    projectId: string;
    refTable: AiUsageRefTable;
    refId: string;
    aiUsageAction: AiUsageAction;
    userGroupId?: string | null;
    aiModelName: AiModelName;
  };
};

export type AiUsageUpdateData = {
  userGroupId?: string | null;
};

export type AiUsageStopRecordData = {
  tokenUsed: number;
  confidence: number;
};

export type AiUsageSaveOpts = {
  disableEvent?: boolean;
};
