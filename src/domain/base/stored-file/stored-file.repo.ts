import { Injectable } from '@nestjs/common';

import { diff } from '@shared/common/common.func';
import { BaseRepo } from '@shared/common/common.repo';

import { StoredFile } from './stored-file.domain';
import { StoredFileMapper } from './stored-file.mapper';

@Injectable()
export class StoredFileRepo extends BaseRepo {
  async create(storedFile: StoredFile): Promise<void> {
    await this.db
      //
      .insertInto('stored_files')
      .values(StoredFileMapper.toPg(storedFile))
      .execute();
  }

  async update(id: string, storedFile: StoredFile): Promise<void> {
    const data = diff(storedFile.pgState, StoredFileMapper.toPg(storedFile));
    if (!data) {
      return;
    }

    await this.db
      //
      .updateTable('stored_files')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  async findOne(id: string): Promise<StoredFile | null> {
    const storedFilePg = await this.readDb
      .selectFrom('stored_files')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!storedFilePg) {
      return null;
    }

    const storedFile = StoredFileMapper.fromPgWithState(storedFilePg);
    return storedFile;
  }

  async delete(id: string): Promise<void> {
    await this.db
      //
      .deleteFrom('stored_files')
      .where('id', '=', id)
      .execute();
  }

  async deleteRelated(ownerIds: string[]): Promise<void> {
    await this.db
      //
      .deleteFrom('stored_files')
      .where('owner_id', 'in', ownerIds)
      .execute();
  }
}
