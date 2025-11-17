import type { DBModel } from '@infra/db/db.common';
import type { StoredFiles } from '@infra/db/db.d';

import type { Plain, Serialized } from '@shared/common/common.type';

import type { StoredFile } from '../stored-file.domain';

export type StoredFilePg = DBModel<StoredFiles>;
export type StoredFilePlain = Plain<StoredFile>;

export type StoredFileJson = Serialized<StoredFilePlain>;

export type StoredFileNewData = {
  refName: string;
  keyPath: string;
  ownerTable: string;
  ownerId: string;
  filename: string;
  filesizeByte: number;
  storageName: string;
  presignUrl: string;
  isPublic: boolean;
  mimeType: string;
  extension: string;
  checksum: string;
  expireAt?: Date;
};

export type StoredFileUpdateData = {
  refName?: string;
  keyPath?: string;
  ownerTable?: string;
  ownerId?: string;
  filename?: string;
  filesizeByte?: number;
  storageName?: string;
  presignUrl?: string;
  isPublic?: boolean;
  mimeType?: string;
  extension?: string;
  checksum?: string;
  expireAt?: Date;
};
