import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { getIncludesZod, zodDto } from '@shared/zod/zod.util';

const zod = z.object({
  includes: getIncludesZod([
    'activeUsers',
    'inactiveUsers',
    'pendingRegistrationUsers',
    'lineLinkedUsers',
  ]),
});

export class UserSummaryDto extends zodDto(zod) {}

// ================ Response ================

class UserSummaryResponseData {
  @ApiProperty({ example: 100 })
  totalUsers: number;

  @ApiProperty({ example: 50 })
  activeUsers?: number;

  @ApiProperty({ example: 30 })
  inactiveUsers?: number;

  @ApiProperty({ example: 20 })
  lineLinkedUsers?: number;

  @ApiProperty({ example: 10 })
  pendingRegistrationUsers?: number;
}

export class UserSummaryResponse extends StandardResponse {
  data: UserSummaryResponseData;
}
