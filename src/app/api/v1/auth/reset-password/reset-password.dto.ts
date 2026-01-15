import { PasswordResetTokenResponse } from '@domain/base/password-reset-token/password-reset-token.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ========== Request ==========

const zod = z.object({
  passwordResetToken: z.object({
    token: z.string(),
  }),
  user: z.object({
    password: z.string(),
  }),
});

export class ResetPasswordDto extends zodDto(zod) {}

// ========== Response ==========

class ResetPasswordDataRelationsPasswordResetToken {
  @ApiProperty({ type: () => PasswordResetTokenResponse })
  attributes: PasswordResetTokenResponse;
}

class ResetPasswordDataUserRelations {
  @ApiProperty({ type: () => ResetPasswordDataRelationsPasswordResetToken })
  passwordResetToken: ResetPasswordDataRelationsPasswordResetToken;
}

class ResetPasswordDataUser {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;

  @ApiProperty({ type: () => ResetPasswordDataUserRelations })
  relations: ResetPasswordDataUserRelations;
}

class ResetPasswordData {
  @ApiProperty({ type: () => ResetPasswordDataUser })
  user: ResetPasswordDataUser;

  @ApiProperty({ example: 'token' })
  token: string;
}

export class ResetPasswordResponse extends StandardResponse {
  @ApiProperty({ type: () => ResetPasswordData })
  data: ResetPasswordData;
}
