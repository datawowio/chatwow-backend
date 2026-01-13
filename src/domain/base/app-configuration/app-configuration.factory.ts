import { match } from 'ts-pattern';
import type { SetRequired } from 'type-fest';

import { uuidV7 } from '@shared/common/common.crypto';
import myDayjs from '@shared/common/common.dayjs';
import { valueOr } from '@shared/common/common.func';
import { isDefined } from '@shared/common/common.validator';

import { AppConfiguration } from './app-configuration.domain';
import { appConfigurationFromPlain } from './app-configuration.mapper';
import type {
  AppConfigData,
  AppConfigKey,
  AppConfigurationNewData,
  AppConfigurationPlain,
} from './app-configuration.type';

export function newAppConfiguration<K extends AppConfigKey>(
  data: AppConfigurationNewData<K>,
): AppConfiguration<K> {
  return appConfigurationFromPlain({
    id: uuidV7(),
    createdAt: myDayjs().toDate(),
    updatedAt: myDayjs().toDate(),
    configKey: data.configKey,
    configData: data.configData,
  });
}

export function newAppConfigurations<K extends AppConfigKey>(
  data: AppConfigurationNewData<K>[],
) {
  return data.map((d) => newAppConfiguration(d));
}

export function mockAppConfiguration<K extends AppConfigKey>(
  data: SetRequired<Partial<AppConfigurationPlain<AppConfigKey>>, 'configKey'>,
): AppConfiguration<K> {
  return appConfigurationFromPlain({
    id: isDefined(data.id) ? data.id : uuidV7(),
    createdAt: isDefined(data.createdAt) ? data.createdAt : myDayjs().toDate(),
    updatedAt: isDefined(data.updatedAt) ? data.updatedAt : myDayjs().toDate(),
    configKey: data.configKey,
    configData: valueOr(
      data.configData,
      match(data.configKey)
        .with(
          'AI',
          () =>
            ({
              apiKey: 'test-key',
              model: 'GPT_DW',
            }) satisfies AppConfigData['AI'],
        )
        .exhaustive(),
    ),
  }) as AppConfiguration<K>;
}

export function mockAppConfigurations<K extends AppConfigKey>(
  amount: number,
  data: SetRequired<Partial<AppConfigurationPlain<AppConfigKey>>, 'configKey'>,
): AppConfiguration<K>[] {
  return Array(amount)
    .fill(0)
    .map(() => mockAppConfiguration(data));
}
