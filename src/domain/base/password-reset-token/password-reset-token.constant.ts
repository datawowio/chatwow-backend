import myDayjs from '@shared/common/common.dayjs';

export const PASSWORD_RESET_DEFAULT_EXPIRY_SECONDS = myDayjs
  .duration({ days: 1 })
  .asSeconds();
