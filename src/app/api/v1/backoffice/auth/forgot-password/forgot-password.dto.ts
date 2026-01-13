import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ========== Request ==========

const zod = z.object({
  user: z.object({
    email: z.string().email(),
  }),
});

export class ForgotPasswordDto extends zodDto(zod) {}

// ========== Response ==========

export class ForgotPasswordResponse extends StandardResponse {
  data: object;
}
