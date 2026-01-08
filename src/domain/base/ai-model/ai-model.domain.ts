import Big from 'big.js';

import { AiModelName } from '@infra/db/db';

import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import type {
  AiModelPg,
  AiModelPlain,
  AiModelUpdateData,
} from './ai-model.type';

export class AiModel extends DomainEntity<AiModelPg> {
  readonly aiModelName: AiModelName;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly pricePerToken: Big;

  constructor(plain: AiModelPlain) {
    super();
    Object.assign(this, plain);
  }

  edit(data: AiModelUpdateData) {
    const plain: AiModelPlain = {
      aiModelName: this.aiModelName,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      pricePerToken: isDefined(data.pricePerToken)
        ? data.pricePerToken
        : this.pricePerToken,
    };

    Object.assign(this, plain);
  }
}
