import { AiModelName } from '@domain/base/ai-model/ai-model.type';
import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { queryCount } from '@infra/db/db.util';

import { diff } from '@shared/common/common.func';

import { AiModel } from './ai-model.domain';
import { aiModelFromPgWithState, aiModelToPg } from './ai-model.mapper';
import { aiModelsTableFilter } from './ai-model.util';
import { AiModelFilterOptions } from './ai-model.zod';

@Injectable()
export class AiModelService {
  constructor(private db: MainDb) {}

  async getCount(opts?: AiModelFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findOne(modelName: AiModelName): Promise<AiModel | null> {
    const aiModelPg = await this.db.read
      .selectFrom('ai_models')
      .selectAll('ai_models')
      .where('ai_model_name', '=', modelName)
      .limit(1)
      .executeTakeFirst();

    if (!aiModelPg) {
      return null;
    }

    const aiModel = aiModelFromPgWithState(aiModelPg);
    return aiModel;
  }

  async save(aiModel: AiModel) {
    this._validate(aiModel);

    if (!aiModel.isPersist) {
      await this._create(aiModel);
    } else {
      await this._update(aiModel.aiModelName, aiModel);
    }

    aiModel.setPgState(aiModelToPg);
  }

  async saveBulk(aiModels: AiModel[]) {
    return Promise.all(aiModels.map((p) => this.save(p)));
  }

  async delete(modelName: AiModelName) {
    await this.db.write
      //
      .deleteFrom('ai_models')
      .where('ai_model_name', '=', modelName)
      .execute();
  }

  async deleteBulk(modelNames: AiModelName[]) {
    await Promise.all(modelNames.map((modelName) => this.delete(modelName)));
  }

  private async _create(aiModel: AiModel): Promise<void> {
    await this.db.write
      //
      .insertInto('ai_models')
      .values(aiModelToPg(aiModel))
      .execute();
  }

  private async _update(id: AiModelName, aiModel: AiModel): Promise<void> {
    const data = diff(aiModel.pgState, aiModelToPg(aiModel));
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('ai_models')
      .set(data)
      .where('ai_model_name', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: AiModelFilterOptions) {
    const { filter } = opts || {};

    return this.db.read
      .selectFrom('ai_models')
      .where(aiModelsTableFilter)
      .$if(!!filter?.aiModels?.length, (qb) =>
        qb.where('ai_models.ai_model_name', 'in', filter!.aiModels!),
      );
  }

  private _validate(_aiModel: AiModel) {
    // validation rules can be added here
  }
}
