import type {
  UserJson,
  UserPg,
} from '@domain/base/user/types/user.domain.type';

import type { WithPgState } from '@shared/common/common.type';

export type SendVerificationJobData = WithPgState<UserJson, UserPg>;
