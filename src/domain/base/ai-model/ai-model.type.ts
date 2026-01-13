import Big from 'big.js';

import type { AiModelName, AiModels } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { AiModel } from './ai-model.domain';

export type AiModelPg = DBModel<AiModels>;
export type AiModelPlain = Plain<AiModel>;

export type AiModelJson = Serialized<AiModelPlain>;

export type AiModelNewData = {
  aiModel: AiModelName;
  pricePerToken: Big;
};

export type AiModelUpdateData = {
  pricePerToken?: Big;
};
