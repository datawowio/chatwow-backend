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

export class UpdateProfileDto extends zodDto(zod) {}

// ==================== Response ====================

export class UpdateProfileUserResource {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

export class UpdateProfileData {
  @ApiProperty({ type: () => UpdateProfileUserResource })
  user: UpdateProfileUserResource;
}

export class UpdateProfileResponse extends StandardResponse {
  @ApiProperty({ type: () => UpdateProfileData })
  data: UpdateProfileData;
}
