import type { AppConfigurations } from '@infra/db/db';
import type { DBModel } from '@infra/db/db.common';

import type {
  Plain,
  Serialized,
  WithPgState,
} from '@shared/common/common.type';

import { AiModelName } from '../ai-model/ai-model.type';
import type { AppConfiguration } from './app-configuration.domain';

export type AppConfigurationPg = DBModel<AppConfigurations>;
export type AppConfigurationPlain<T extends AppConfigKey> = Plain<
  AppConfiguration<T>
>;

export type AppConfigurationJson<T extends AppConfigKey> = Serialized<
  AppConfigurationPlain<T>
>;
export type AppConfigurationJsonState<T extends AppConfigKey> = WithPgState<
  AppConfigurationJson<T>,
  AppConfigurationPg
>;

export type AppConfigKey = keyof AppConfigData;
export type AppConfigData = {
  AI: { model: AiModelName; apiKey: string | null };
};

export type AppConfigurationNewData<K extends AppConfigKey> = {
  configKey: K;
  configData: AppConfigData[K];
};

export type AppConfigurationUpdateData<K extends AppConfigKey> = {
  configData: AppConfigData[K];
};
