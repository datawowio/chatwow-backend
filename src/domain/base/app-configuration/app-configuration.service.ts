import { Injectable } from '@nestjs/common';

import { MainDb } from '@infra/db/db.main';
import { queryCount } from '@infra/db/db.util';
import { CacheService } from '@infra/global/cache/cache.service';

import { diff } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';
import { ApiException } from '@shared/http/http.exception';

import { AppConfiguration } from './app-configuration.domain';
import {
  appConfigurationFromJsonState,
  appConfigurationFromPgWithState,
  appConfigurationToJsonState,
  appConfigurationToPg,
} from './app-configuration.mapper';
import {
  AppConfigKey,
  AppConfigurationJsonState,
} from './app-configuration.type';
import { appConfigurationsTableFilter } from './app-configuration.util';
import { AppConfigurationFilterOptions } from './app-configuration.zod';

@Injectable()
export class AppConfigurationService {
  constructor(
    private db: MainDb,
    private cacheService: CacheService,
  ) {}

  async getCount(opts?: AppConfigurationFilterOptions) {
    const totalCount = await this
      //
      ._getFilterQb(opts)
      .$call((q) => queryCount(q));

    return totalCount;
  }

  async findConfig<K extends AppConfigKey>(
    key: K,
  ): Promise<AppConfiguration<K>> {
    let data = await this._getFromCache(key);
    if (!data) {
      const appConfigurationPg = await this.db.read
        .selectFrom('app_configurations')
        .selectAll('app_configurations')
        .where('config_key', '=', key)
        .limit(1)
        .executeTakeFirst();

      if (!appConfigurationPg) {
        throw new ApiException(500, 'configKeyNotFound');
      }

      data = appConfigurationFromPgWithState(
        appConfigurationPg,
      ) as AppConfiguration<K>;

      await this._setCache(data);
    }

    return data;
  }

  async save(appConfiguration: AppConfiguration<AppConfigKey>) {
    this._validate(appConfiguration);

    if (!appConfiguration.isPersist) {
      await this._create(appConfiguration);
    } else {
      await this._update(appConfiguration.id, appConfiguration);
    }

    appConfiguration.setPgState(appConfigurationToPg);

    // set cache
    await this._setCache(appConfiguration);
  }

  async saveBulk(appConfigurations: AppConfiguration<AppConfigKey>[]) {
    return Promise.all(appConfigurations.map((p) => this.save(p)));
  }

  async delete(id: string) {
    await this.db.write
      //
      .deleteFrom('app_configurations')
      .where('id', '=', id)
      .execute();
  }

  async deleteBulk(ids: string[]) {
    await Promise.all(ids.map((id) => this.delete(id)));
  }

  private async _create(
    appConfiguration: AppConfiguration<AppConfigKey>,
  ): Promise<void> {
    await this.db.write
      //
      .insertInto('app_configurations')
      .values(appConfigurationToPg(appConfiguration))
      .execute();
  }

  private async _update(
    id: string,
    appConfiguration: AppConfiguration<AppConfigKey>,
  ): Promise<void> {
    const data = diff(
      appConfiguration.pgState,
      appConfigurationToPg(appConfiguration),
    );
    if (!data) {
      return;
    }

    await this.db.write
      //
      .updateTable('app_configurations')
      .set(data)
      .where('id', '=', id)
      .execute();
  }

  private _getFilterQb(opts?: AppConfigurationFilterOptions) {
    const { filter } = opts || {};

    return this.db.read
      .selectFrom('app_configurations')
      .where(appConfigurationsTableFilter)
      .$if(isDefined(filter?.configKey), (qb) =>
        qb.where('config_key', '=', filter!.configKey!),
      );
  }

  private _validate(_appConfiguration: AppConfiguration<AppConfigKey>) {
    // validation rules can be added here
  }

  private async _getFromCache<K extends AppConfigKey>(
    configKey: K,
  ): Promise<AppConfiguration<K>> {
    const key = this._generateCacheKey(configKey);
    const json = (await this.cacheService.get(
      key,
    )) as AppConfigurationJsonState<K>;

    return appConfigurationFromJsonState(json) as AppConfiguration<K>;
  }

  private async _setCache<K extends AppConfigKey>(data: AppConfiguration<K>) {
    const key = this._generateCacheKey(data.configKey);
    const json = appConfigurationToJsonState(data);

    await this.cacheService.set(key, json);
  }

  private _generateCacheKey(suffix: string) {
    return `app-config:${suffix}`;
  }
}
