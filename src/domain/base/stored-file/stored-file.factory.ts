import { getFileExtension } from '@shared/common/common.buffer';

import { STORED_FILE_REF_NAME } from './stored-file.constant';
import { storedFileFromPlain } from './stored-file.mapper';
import type { StoredFileNewData } from './stored-file.type';
import { getStoredFileKey } from './stored-file.util';

export function newStoredFile(data: StoredFileNewData) {
  return storedFileFromPlain({
    id: data.id,
    refName: data.refName || STORED_FILE_REF_NAME.DEFAULT,
    ownerTable: data.ownerTable,
    ownerId: data.ownerId,
    filename: data.filename,
    filesizeByte: data.filesizeByte || 0,
    storageName: data.storageName || 's3',
    isPublic: data.isPublic || false,
    createdAt: new Date(),
    updatedAt: new Date(),
    extension: getFileExtension(data.filename),
    checksum: null,
    expireAt: data.expireAt || null,
    keyPath: getStoredFileKey({
      id: data.id,
      ownerTable: data.ownerTable,
      isPublic: data.isPublic || false,
    }),
    presignUrl: null,
    mimeType: null,
  });
}

export function newStoredFiles(data: StoredFileNewData[]) {
  return data.map((d) => newStoredFile(d));
}
