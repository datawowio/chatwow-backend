import { PasswordResetTokenResponse } from '@domain/base/password-reset-token/password-reset-token.response';
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';
import z from 'zod';

import { StandardResponse } from '@shared/http/http.response.dto';
import { zodDto } from '@shared/zod/zod.util';

// ========== Request ==========

const zod = z.object({
  token: z.string(),
});

export class CheckResetPasswordDto extends zodDto(zod) {}

// ========== Response ==========

class CheckResetPasswordDataRelationsPasswordResetToken {
  @ApiProperty({ type: () => PasswordResetTokenResponse })
  attributes: PasswordResetTokenResponse;
}

class CheckResetPasswordDataUserRelations {
  @ApiProperty({
    type: () => CheckResetPasswordDataRelationsPasswordResetToken,
  })
  passwordResetToken: CheckResetPasswordDataRelationsPasswordResetToken;
}

class CheckResetPasswordDataUser {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;

  @ApiProperty({ type: () => CheckResetPasswordDataUserRelations })
  relations: CheckResetPasswordDataUserRelations;
}

class CheckResetPasswordData {
  @ApiProperty({ type: () => CheckResetPasswordDataUser })
  user: CheckResetPasswordDataUser;

  @ApiProperty({ example: 'token' })
  token: string;
}

export class CheckResetPasswordResponse extends StandardResponse {
  @ApiProperty({ type: () => CheckResetPasswordData })
  data: CheckResetPasswordData;
}
