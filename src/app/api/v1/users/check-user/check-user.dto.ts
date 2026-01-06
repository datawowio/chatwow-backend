import { userFilterZod } from '@domain/base/user/user.zod';
import { ApiProperty } from '@nestjs/swagger';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

const zod = userFilterZod;

export class CheckUserDto extends zodDto(zod) {}

// ==================== Response ====================

export class CheckUserMeta {
  exists?: boolean;
}
export class CheckUserResponse extends StandardResponse {
  meta: CheckUserMeta;

  @ApiProperty()
  data: object;
}
