import { customAlphabet } from 'nanoid';

import { EB } from '@infra/db/db.common';

const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // removes I, O avoid confusion
const ALPHANUM = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // removes 0,1,I,O avoid confusion
const genVerification = customAlphabet(LETTERS + ALPHANUM, 6);
export function generateVerificationCode() {
  return genVerification();
}

export function isVerificationCode(code: string): boolean {
  // 1st char: letter (A–Z, excluding I, O)
  // 2–5:      alphanum (2–9, A–Z, excluding 0,1,I,O)
  // 6th char: letter (A–Z, excluding I, O)
  const regex = /^[A-HJ-NP-Z][2-9A-HJ-NP-Z]{4}[A-HJ-NP-Z]$/;
  return regex.test(code);
}

export function usersVerificationsTableFilter(eb: EB<'user_verifications'>) {
  // no base filter
  return eb.and([]);
}
