import type { UserJson, UserPg } from '@domain/base/user/user.type';

import { TaskData } from '@app/worker/worker.type';

import type { WithPgState } from '@shared/common/common.type';

export type SendVerificationJobData = WithPgState<UserJson, UserPg>;
export type SendVerificationJobInput = TaskData<WithPgState<UserJson, UserPg>>;
