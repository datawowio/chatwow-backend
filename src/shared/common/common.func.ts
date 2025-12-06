import { faker } from '@faker-js/faker';
import { render } from '@react-email/render';
import * as path from 'path';
import type React from 'react';
import * as R from 'remeda';

import { ApiException } from '../http/http.exception';
import type { ObjectWithId, Read } from './common.type';

export function isProd(env: string) {
  return env === 'prod';
}

export function isTesting(env: string) {
  return env === 'test';
}

export function isLocal(env: string) {
  return env === 'local';
}

export function getRandomId(objs: { id: string }[]) {
  const randomNum = faker.number.int(objs.length - 1);
  return objs[randomNum].id;
}

export function getRandomIds(amount: number, objs: { id: string }[]) {
  if (amount > objs.length) {
    throw new Error('Amount exceeds available objects');
  }

  if (amount === objs.length) {
    return objs.map((o) => o.id);
  }

  const idSet = new Set<string>();
  while (idSet.size < amount) {
    const randomNum = faker.number.int({ min: 0, max: objs.length - 1 });
    idSet.add(objs[randomNum].id);
  }

  return Array.from(idSet.values());
}

export function clone<T>(obj: Read<T>): T {
  return structuredClone(obj) as T;
}

export function isEmptyObject(obj: object) {
  if (!obj) {
    return true;
  }

  return !Object.keys(obj).length;
}

export function validateCsvFile(file: Express.Multer.File): void {
  if (!file) {
    throw new ApiException(400, 'noFile');
  }

  // Size check
  if (file.size > 500 * 1024 * 1024) {
    throw new ApiException(400, 'tooLarge'); // 500MB
  }

  // Mimetype check (best effort, not 100% reliable)
  if (
    file.mimetype !== 'text/csv' &&
    file.mimetype !== 'application/vnd.ms-excel'
  ) {
    throw new ApiException(400, 'invalidType');
  }

  // Extension check (fallback to ensure `.csv`)
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.csv') {
    throw new ApiException(400, 'invalidExt');
  }
}

export function setNestedKey(
  target: Record<string, any>,
  path: (string | number)[],
  message: string,
): void {
  let curr = target;

  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (i === path.length - 1) {
      curr[key] = [message];
    } else {
      curr[key] ||= {};
      curr = curr[key];
    }
  }
}

export function findUnmatched<T extends ObjectWithId>(a: T[], b: T[]): T[] {
  return R.differenceWith(a, b, (x, y) => x.id === y.id);
}

function cleanData(val: unknown) {
  // clean all class to primitive
  if (val instanceof Date) {
    return val.getTime();
  }

  return val;
}
export function diff<T extends object>(
  original: T | null,
  current: T,
): Partial<T> | null {
  if (!original) {
    return null;
  }

  const picked = R.pickBy(
    current,
    (value, key) =>
      !R.isShallowEqual(cleanData(value), cleanData(original[key as string])),
  );

  if (isEmptyObject(picked)) {
    return null;
  }

  return picked;
}

export function getUniqueIds(objs: { id: string }[]) {
  const idSet = new Set<string>();

  objs.forEach((o) => idSet.add(o.id));

  return Array.from(idSet.values());
}

export function renderHtml(template: React.JSX.Element) {
  return render(template);
}

export function prettyPrintJson(obj: object) {
  return JSON.stringify(obj, null, 2);
}

export function valueOr<T>(val: T | undefined, defaultVal: T) {
  if (val === undefined) {
    return defaultVal;
  }

  return val;
}
export function firstValueOr<T>(vals: Array<T | undefined>, defaultVal: T): T {
  for (const v of vals) if (v !== undefined) return v;
  return defaultVal;
}

export function orUndefined<T, V>(
  val: T | undefined | null,
  cb: (data: T) => V,
): V | undefined {
  if (!val) {
    return undefined;
  }

  return cb(val);
}
