import { DomainEntity } from '@shared/common/common.domain';

import type { LineAccountPg, LineAccountPlain } from './line-account.type';

export class LineAccount extends DomainEntity<LineAccountPg> {
  readonly id: string;
  readonly createdAt: Date;

  constructor(plain: LineAccountPlain) {
    super();
    Object.assign(this, plain);
  }
}
