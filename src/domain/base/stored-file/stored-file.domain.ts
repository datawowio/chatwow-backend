import { getFileExtension } from '@shared/common/common.buffer';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { StoredFileMapper } from './stored-file.mapper';
import { getStoredFilesIdFromKey } from './stored-file.util';
import type {
  StoredFileNewData,
  StoredFilePg,
  StoredFilePlain,
  StoredFileUpdateData,
} from './types/stored-file.domain.type';

export class StoredFile extends DomainEntity<StoredFilePg> {
  readonly id: string;
  readonly refName: string;
  readonly keyPath: string;
  readonly ownerTable: string;
  readonly ownerId: string;
  readonly filename: string;
  readonly filesizeByte: number;
  readonly storageName: string;
  readonly isPublic: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly extension: string;
  readonly checksum: string | null;
  readonly presignUrl: string | null;
  readonly expireAt: Date | null;
  readonly mimeType: string | null;

  constructor(plain: StoredFilePlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: StoredFileNewData) {
    return StoredFileMapper.fromPlain({
      id: getStoredFilesIdFromKey(data.keyPath),
      refName: data.refName || 'DEFAULT',
      ownerTable: data.ownerTable,
      ownerId: data.ownerId,
      filename: data.filename,
      filesizeByte: data.filesizeByte,
      storageName: data.storageName || 's3',
      isPublic: data.isPublic || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      extension: getFileExtension(data.filename),
      checksum: null,
      expireAt: data.expireAt || null,
      keyPath: data.keyPath,
      presignUrl: null,
      mimeType: null,
    });
  }

  static newBulk(data: StoredFileNewData[]) {
    return data.map((d) => {
      const plain: StoredFilePlain = StoredFile.new(d);
      return new StoredFile(plain);
    });
  }

  edit(data: StoredFileUpdateData) {
    const plain: StoredFilePlain = {
      id: this.id,
      ownerTable: this.ownerTable,
      ownerId: this.ownerId,
      storageName: this.storageName,
      presignUrl: this.presignUrl,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      mimeType: this.mimeType,
      checksum: this.checksum,
      filesizeByte: this.filesizeByte,

      // dependency update
      extension: isDefined(data.filename)
        ? getFileExtension(data.filename)
        : this.extension,

      // updated fields
      keyPath: isDefined(data.keyPath) ? data.keyPath : this.keyPath,
      filename: isDefined(data.filename) ? data.filename : this.filename,
      refName: isDefined(data.refName) ? data.refName : this.refName,
      expireAt: isDefined(data.expireAt) ? data.expireAt : this.expireAt,
      isPublic: isDefined(data.isPublic) ? data.isPublic : this.isPublic,
    };

    Object.assign(this, plain);
  }

  isFileChanged() {
    return this.keyPath !== this.pgState?.key_path;
  }
}
