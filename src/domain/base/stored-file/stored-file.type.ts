import type { StoredFiles } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { STORED_FILE_OWNER_TABLE } from './stored-file.constant';
import type { StoredFile } from './stored-file.domain';

export type StoredFilePg = DBModel<StoredFiles>;
export type StoredFilePlain = Plain<StoredFile>;

export type StoredFileJson = Serialized<StoredFilePlain>;

export type StoredFileNewData = {
  id: string;
  ownerTable: STORED_FILE_OWNER_TABLE;
  ownerId: string;
  filename: string;
  filesizeByte?: number;
  refName?: string;
  storageName?: string;
  isPublic?: boolean;
  expireAt?: Date;
};

export type StoredFileUpdateData = {
  id?: string;
  filename?: string;
  ownerId?: string;
  refName?: string;
  expireAt?: Date;
  isPublic?: boolean;
  filesizeByte?: number;
  keyPath?: string;
};
