import type duration from 'dayjs/plugin/duration';
import type { ReadonlyDeep, ReadonlyTuple, UnionToTuple } from 'type-fest';

export type Read<T> = ReadonlyDeep<T>;

export type Saved<T> = T & { id: number };

export type Nilable = unknown | undefined | null | string;

export type ObjectWithId = { id: number };

type ClassToPlain<T> = {
  [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

export type Info<K> = {
  key: K;
  context: Record<string, string>;
  fields: Record<string, any>;
};

export type Plain<T> = Omit<ClassToPlain<T>, 'pgState' | 'isPersist'>;

export type SortDir = 'asc' | 'desc';
export type ParsedSort<T extends string> = [T, SortDir][];

export type CursorObj<K extends string, T> = {
  filter: T;
  sort: ParsedSort<K>;
};

export type WithPgState<T, M> = {
  state: M | null;
  data: T;
};

export type AsyncReturn<T extends (...args: any) => any> = NonNullable<
  Awaited<ReturnType<T>>
>;

export type QueryInterface = {
  exec(...query: unknown[]): Promise<unknown>;
  getRaw(...query: unknown[]): Promise<unknown>;
};

export type CommandInterface = {
  exec(...body: unknown[]): Promise<unknown>;
  find?(...body: unknown[]): Promise<unknown>;
  save(...entity: unknown[]): Promise<void>;
};

export type Serialized<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
      ? string | null
      : T[K];
};

export type DayjsDuration = duration.DurationUnitsObjectType;

export type IDomainData = {
  attributes: object;
  relations?: Record<string, any>;
};

export type UnionArray<T extends string> = ReadonlyTuple<
  T,
  UnionToTuple<T>['length'] & number
>;
