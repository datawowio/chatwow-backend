import { createZodDto } from 'nestjs-zod';
import type { ZodError } from 'zod';
import { z } from 'zod';

import { isNumericString } from '@shared/common/common.validator';

import { setNestedKey } from '../common/common.func';
import {
  toNumber,
  toOptionalNumber,
  toSet,
} from '../common/common.transformer';
import type { ParsedSort, SortDir } from '../common/common.type';

export const zodDto = createZodDto;

export const paginationZod = z
  .object({
    page: z.string().optional().transform(toOptionalNumber),
    perPage: z.string().optional().transform(toOptionalNumber),
  })
  .optional();

export const paginationCursorZod = z
  .object({
    cursor: z.string().optional(),
    perPage: z
      .string()
      .refine(isNumericString)
      .default('10')
      .transform(toNumber),
  })
  .optional();

export function getZodErrorFields(zodErr: ZodError) {
  const fields = {};
  for (const err of zodErr.errors) {
    setNestedKey(fields, err.path, err.message);
  }

  return fields;
}

export function getSortZod<T extends string>(fields: readonly [T, ...T[]]) {
  // Ensure non-empty tuple for z.enum
  const [first, ...rest] = fields;
  const enumValues = [
    first as `${T}`,
    `-${first}` as `-${T}`,
    ...rest.flatMap((f) => [f as `${T}`, `-${f}` as `-${T}`] as const),
  ] as [`${T}` | `-${T}`, ...(`${T}` | `-${T}`)[]];

  const SortEnum = z.enum(enumValues);

  return z
    .string()
    .optional()
    .transform((s) => (s ? s.split(',').filter(Boolean) : []))
    .pipe(z.array(SortEnum))
    .transform((parts): ParsedSort<T> | undefined => {
      const res: ParsedSort<T> = [];
      for (const part of parts) {
        const isDesc = part.startsWith('-');
        const key = (isDesc ? part.slice(1) : part) as T;
        const dir: SortDir = isDesc ? 'desc' : 'asc';

        res.push([key, dir]);
      }

      if (!res.length) {
        return undefined;
      }

      return res;
    });
}

export function getIncludesZod<T extends string>(fields: readonly [T, ...T[]]) {
  return z
    .string()
    .optional()
    .transform((s) => (s ? s.split(',').filter(Boolean) : []))
    .pipe(z.array(z.enum(fields)))
    .transform(toSet);
}
