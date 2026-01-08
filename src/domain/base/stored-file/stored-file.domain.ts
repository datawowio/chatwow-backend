import { FileExposeType } from '@infra/db/db';

import { getFileExtension } from '@shared/common/common.buffer';
import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';
import { isDefined } from '@shared/common/common.validator';

import { STORED_FILE_REF_NAME } from './stored-file.constant';
import type {
  StoredFilePg,
  StoredFilePlain,
  StoredFileUpdateData,
} from './stored-file.type';
import { getStoredFileKey } from './stored-file.util';

export class StoredFile extends DomainEntity<StoredFilePg> {
  readonly id: string;
  readonly refName: STORED_FILE_REF_NAME;
  readonly keyPath: string;
  readonly ownerTable: string;
  readonly ownerId: string;
  readonly filename: string;
  readonly filesizeByte: number;
  readonly storageName: string;
  readonly fileExposeType: FileExposeType;
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

  edit(data: StoredFileUpdateData) {
    const plain: StoredFilePlain = {
      keyPath: getStoredFileKey({
        id: isDefined(data.id) ? data.id : this.id,
        ownerTable: this.ownerTable,
      }),
      ownerTable: this.ownerTable,
      storageName: this.storageName,
      presignUrl: this.presignUrl,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      mimeType: this.mimeType,
      checksum: this.checksum,
      filesizeByte: this.filesizeByte,

      // dependency update
      id: isDefined(data.id) ? data.id : this.id,
      extension: isDefined(data.filename)
        ? getFileExtension(data.filename)
        : this.extension,

      // updated fields
      ownerId: isDefined(data.ownerId) ? data.ownerId : this.ownerId,
      filename: isDefined(data.filename) ? data.filename : this.filename,
      refName: isDefined(data.refName) ? data.refName : this.refName,
      expireAt: isDefined(data.expireAt) ? data.expireAt : this.expireAt,
      fileExposeType: isDefined(data.fileExposeType)
        ? data.fileExposeType
        : this.fileExposeType,
    };

    Object.assign(this, plain);
  }

  isFileChanged() {
    return this.keyPath !== this.pgState?.key_path;
  }
}
