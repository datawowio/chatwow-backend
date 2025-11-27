import { customAlphabet } from 'nanoid';

import { EB } from '@infra/db/db.common';

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // removes I, O avoid confusion
const ALPHANUM = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // removes 0,1,I,O avoid confusion
const genVerification = customAlphabet(LETTERS + ALPHANUM, 6);
export function generateVerificationCode() {
  return genVerification();
}

export function usersVerificationsTableFilter(eb: EB<'user_verifications'>) {
  // no base filter
  return eb.and([]);
}
