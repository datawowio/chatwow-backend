import type { DBModel } from '@infra/db/db.common';
import type { StoredFiles } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { StoredFile } from '../stored-file.domain';

export type StoredFilePg = DBModel<StoredFiles>;
export type StoredFilePlain = Plain<StoredFile>;

export type StoredFileJson = Serialized<StoredFilePlain>;

export type StoredFileNewData = {
  ownerTable: string;
  ownerId: string;
  filename: string;
  filesizeByte: number;
  keyPath: string;
  refName?: string;
  storageName?: string;
  isPublic?: boolean;
  expireAt?: Date;
};

export type StoredFileUpdateData = {
  filename?: string;
  refName?: string;
  expireAt?: Date;
  isPublic?: boolean;
  filesizeByte?: number;
  keyPath?: string;
};
