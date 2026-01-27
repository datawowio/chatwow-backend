import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

const zod = z.object({
  password: z.string().optional(),
});

export class CheckProfileDto extends zodDto(zod) {}

// ==================== Response ====================

export class CheckProfileData {
  isPasswordValid?: boolean;
}
export class CheckProfileResponse extends StandardResponse {
  @ApiProperty({ type: () => CheckProfileData })
  data: CheckProfileData;
}
