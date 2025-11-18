// import { uuidV7 } from '@shared/common/common.crypto';
// import { isDefined } from '@shared/common/common.validator';

// import { StoredFileMapper } from './stored-file.mapper';
// import type { StoredFilePlain } from './types/stored-file.domain.type';

// export class StoredFileFactory {
//   static mock(data: Partial<StoredFilePlain>) {
//     return StoredFileMapper.fromPlain({
//       id: isDefined(data.id) ? data.id : uuidV7(),
//       refName: isDefined(data.refName) ? data.refName : 'test-ref',
//       keyPath: isDefined(data.keyPath) ? data.keyPath : 'test/path',
//       ownerTable: isDefined(data.ownerTable) ? data.ownerTable : 'users',
//       ownerId: isDefined(data.ownerId) ? data.ownerId : uuidV7(),
//       filename: isDefined(data.filename) ? data.filename : 'test.txt',
//       filesizeByte: isDefined(data.filesizeByte) ? data.filesizeByte : null,
//       storageName: isDefined(data.storageName) ? data.storageName : 's3',
//       presignUrl: isDefined(data.presignUrl) ? data.presignUrl : null,
//       isPublic: isDefined(data.isPublic) ? data.isPublic : false,
//       createdAt: isDefined(data.createdAt) ? data.createdAt : new Date(),
//       updatedAt: isDefined(data.updatedAt) ? data.updatedAt : new Date(),
//       extension: isDefined(data.extension) ? data.extension : null,
//       checksum: isDefined(data.checksum) ? data.checksum : null,
//       expireAt: isDefined(data.expireAt) ? data.expireAt : null,
//     });
//   }

//   static mockBulk(amount: number, data: Partial<StoredFilePlain>) {
//     return Array(amount)
//       .fill(0)
//       .map(() => this.mock(data));
//   }
// }
