import { UserGroupResponse } from '@domain/base/user-group/user-group.response';
import { ApiProperty } from '@nestjs/swagger';

import type { IDomainData } from '@shared/common/common.type';
import { StandardResponse } from '@shared/http/http.response.dto';

// ==================== Request ====================

// ==================== Response ====================

class DeleteUserGroupUserGroupData implements IDomainData {
  @ApiProperty({ type: () => UserGroupResponse })
  attributes: UserGroupResponse;
}

class DeleteUserGroupData {
  @ApiProperty({ type: () => DeleteUserGroupUserGroupData })
  userGroup: DeleteUserGroupUserGroupData;
}

export class DeleteUserGroupResponse extends StandardResponse {
  @ApiProperty({ type: () => DeleteUserGroupData })
  data: DeleteUserGroupData;
}
