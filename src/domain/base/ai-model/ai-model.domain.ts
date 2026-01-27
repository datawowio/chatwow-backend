import { AiModelName } from '@domain/base/ai-model/ai-model.type';

import { DomainEntity } from '@shared/common/common.domain';

import type {
  AiModelConfig,
  AiModelPg,
  AiModelPlain,
  AiModelProvider,
} from './ai-model.type';

export class AiModel extends DomainEntity<AiModelPg> {
  readonly aiModelName: AiModelName;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly provider: AiModelProvider;
  readonly config: AiModelConfig;

  constructor(plain: AiModelPlain) {
    super();
    Object.assign(this, plain);
  }
}
