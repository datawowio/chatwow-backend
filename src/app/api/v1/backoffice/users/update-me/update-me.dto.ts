import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

export const zod = z.object({
  user: z.object({
    passwordData: z
      .object({
        password: z.string(),
        oldPassword: z.string(),
      })
      .optional(),
  }),
});

export class UpdateMeDto extends zodDto(zod) {}

// ==================== Response ====================

export class UpdateMeUserResource {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class UpdateMeData {
  @ApiProperty({ type: () => UpdateMeUserResource })
  user: UpdateMeUserResource;
}

export class UpdateMeResponse extends StandardResponse {
  @ApiProperty({ type: () => UpdateMeData })
  data: UpdateMeData;
}
