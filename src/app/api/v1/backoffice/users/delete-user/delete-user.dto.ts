import { UserResponse } from '@domain/base/user/user.response';
import { ApiProperty } from '@nestjs/swagger';

import type { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// ==================== Request ====================

// ==================== Response ====================

class DeleteUserUserData implements IDomainData {
  @ApiProperty({ type: () => UserResponse })
  attributes: UserResponse;
}

class DeleteUserData {
  @ApiProperty({ type: () => DeleteUserUserData })
  user: DeleteUserUserData;
}

export class DeleteUserResponse extends StandardResponse {
  @ApiProperty({ type: () => DeleteUserData })
  data: DeleteUserData;
}
