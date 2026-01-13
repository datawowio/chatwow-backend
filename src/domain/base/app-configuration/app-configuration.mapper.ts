import {
  toDate,
  toISO,
  toResponseDate,
} from '@shared/common/common.transformer';
import type { WithPgState } from '@shared/common/common.type';

import { AppConfiguration } from './app-configuration.domain';
import type { AppConfigurationResponse } from './app-configuration.response';
import type {
  AppConfigData,
  AppConfigKey,
  AppConfigurationJson,
  AppConfigurationPg,
  AppConfigurationPlain,
} from './app-configuration.type';

export function appConfigurationFromPg(
  pg: AppConfigurationPg,
): AppConfiguration<AppConfigKey> {
  const plain: AppConfigurationPlain<AppConfigKey> = {
    id: pg.id,
    createdAt: toDate(pg.created_at),
    updatedAt: toDate(pg.updated_at),
    configKey: pg.config_key as AppConfigKey,
    configData: pg.config_data as AppConfigData[AppConfigKey],
  };

  return appConfigurationFromPlain(plain);
}

export function appConfigurationFromPgWithState(
  pg: AppConfigurationPg,
): AppConfiguration<AppConfigKey> {
  return appConfigurationFromPg(pg).setPgState(appConfigurationToPg);
}

export function appConfigurationFromPlain<
  T extends AppConfigurationPlain<AppConfigKey>,
>(plainData: T): AppConfiguration<T['configKey']> {
  return new AppConfiguration(plainData);
}

export function appConfigurationFromJson(
  json: AppConfigurationJson<AppConfigKey>,
): AppConfiguration<AppConfigKey> {
  const plain: AppConfigurationPlain<AppConfigKey> = {
    id: json.id,
    configKey: json.configKey,
    configData: json.configData,
    createdAt: toDate(json.createdAt),
    updatedAt: toDate(json.updatedAt),
  };

  return appConfigurationFromPlain(plain);
}
export function appConfigurationFromJsonState(
  jsonState: WithPgState<
    AppConfigurationJson<AppConfigKey>,
    AppConfigurationPg
  >,
) {
  const domain = appConfigurationFromJson(jsonState.data);
  domain.setPgState(jsonState.state);

  return domain;
}

export function appConfigurationToPg(
  domain: AppConfiguration<AppConfigKey>,
): AppConfigurationPg {
  return {
    id: domain.id,
    created_at: toISO(domain.createdAt),
    updated_at: toISO(domain.updatedAt),
    config_key: domain.configKey,
    config_data: domain.configData,
  };
}

export function appConfigurationToPlain(
  domain: AppConfiguration<AppConfigKey>,
): AppConfigurationPlain<AppConfigKey> {
  return {
    id: domain.id,
    createdAt: domain.createdAt,
    updatedAt: domain.updatedAt,
    configKey: domain.configKey,
    configData: domain.configData,
  };
}

export function appConfigurationToJson(
  domain: AppConfiguration<AppConfigKey>,
): AppConfigurationJson<AppConfigKey> {
  return {
    id: domain.id,
    createdAt: toISO(domain.createdAt),
    updatedAt: toISO(domain.updatedAt),
    configKey: domain.configKey,
    configData: domain.configData,
  };
}
export function appConfigurationToJsonState(
  domain: AppConfiguration<AppConfigKey>,
): WithPgState<AppConfigurationJson<AppConfigKey>, AppConfigurationPg> {
  return {
    state: domain.pgState,
    data: appConfigurationToJson(domain),
  };
}

export function appConfigurationToResponse(
  domain: AppConfiguration<AppConfigKey>,
): AppConfigurationResponse {
  return {
    id: domain.id,
    createdAt: toResponseDate(domain.createdAt),
    updatedAt: toResponseDate(domain.updatedAt),
    configKey: domain.configKey,
    configData: domain.configData,
  };
}

export function appConfigurationPgToResponse(
  pg: AppConfigurationPg,
): AppConfigurationResponse {
  return appConfigurationToResponse(appConfigurationFromPg(pg));
}
