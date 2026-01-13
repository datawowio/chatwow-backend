import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

const zod = z.object({
  password: z.string().optional(),
});

export class CheckMeDto extends zodDto(zod) {}

// ==================== Response ====================

export class CheckMeData {
  isPasswordValid?: boolean;
}
export class CheckMeResponse extends StandardResponse {
  @ApiProperty({ type: () => CheckMeData })
  data: CheckMeData;
}
