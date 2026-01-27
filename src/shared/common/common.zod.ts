import { anyPass } from 'remeda';
import z from 'zod';

import { toSplitCommaArray } from './common.transformer';
import { isISOString, isUndefined, isUuid } from './common.validator';

export const parmUuidsZod = z
  .string()
  .transform(toSplitCommaArray)
  .refine((v) => v.every(isUuid), { message: 'invalidUuid' });

export const IsoZod = z.string().refine(anyPass([isUndefined, isISOString]));
