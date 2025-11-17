import { uuidV7 } from '@shared/common/common.crypto';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

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
  readonly presignUrl: string;
  readonly isPublic: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly mimeType: string;
  readonly extension: string;
  readonly checksum: string;
  readonly expireAt: Date | null;

  constructor(plain: StoredFilePlain) {
    super();
    Object.assign(this, plain);
  }

  static new(data: StoredFileNewData) {
    return {
      id: uuidV7(),
      refName: data.refName,
      keyPath: data.keyPath,
      ownerTable: data.ownerTable,
      ownerId: data.ownerId,
      filename: data.filename,
      filesizeByte: data.filesizeByte || null,
      storageName: data.storageName || 's3',
      presignUrl: data.presignUrl || null,
      isPublic: data.isPublic || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      mimeType: data.mimeType || null,
      extension: data.extension || null,
      checksum: data.checksum || null,
      expireAt: data.expireAt || null,
    } as StoredFilePlain;
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
      refName: isDefined(data.refName) ? data.refName : this.refName,
      keyPath: isDefined(data.keyPath) ? data.keyPath : this.keyPath,
      ownerTable: isDefined(data.ownerTable)
        ? data.ownerTable
        : this.ownerTable,
      ownerId: isDefined(data.ownerId) ? data.ownerId : this.ownerId,
      filename: isDefined(data.filename) ? data.filename : this.filename,
      filesizeByte: isDefined(data.filesizeByte)
        ? data.filesizeByte
        : this.filesizeByte,
      storageName: isDefined(data.storageName)
        ? data.storageName
        : this.storageName,
      presignUrl: isDefined(data.presignUrl)
        ? data.presignUrl
        : this.presignUrl,
      isPublic: isDefined(data.isPublic) ? data.isPublic : this.isPublic,
      createdAt: this.createdAt,
      updatedAt: new Date(),
      mimeType: isDefined(data.mimeType) ? data.mimeType : this.mimeType,
      extension: isDefined(data.extension) ? data.extension : this.extension,
      checksum: isDefined(data.checksum) ? data.checksum : this.checksum,
      expireAt: isDefined(data.expireAt) ? data.expireAt : this.expireAt,
    };

    Object.assign(this, plain);
  }
}
