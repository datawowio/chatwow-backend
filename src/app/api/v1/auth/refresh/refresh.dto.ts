// ========== Response ==========
import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';

import { StandardResponse } from '@shared/http/http.response.dto';

class UserData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class RefreshData {
  @ApiProperty({ type: () => UserData })
  user: UserData;

  @ApiProperty({ example: 'token' })
  token: string;
}

export class RefreshResponse extends StandardResponse {
  @ApiProperty({ type: () => RefreshData })
  data: RefreshData;
}
