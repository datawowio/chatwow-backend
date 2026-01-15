import { UserResponse } from '@domain/base/user/user.response';
import { SIGN_IN_MODE } from '@domain/logic/auth/auth.constant';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ========== Request ==========

const zod = z.object({
  email: z.string().email(),
  password: z.string(),
  mode: z.enum(SIGN_IN_MODE),
});

export class SignInDto extends zodDto(zod) {}

// ========== Response ==========

class UserData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class SignInData {
  @ApiProperty({ type: () => UserData })
  user: UserData;

  @ApiProperty({ example: 'token' })
  token: string;
}

export class SignInResponse extends StandardResponse {
  @ApiProperty({ type: () => SignInData })
  data: SignInData;
}
