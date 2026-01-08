import myDayjs from '@shared/common/common.dayjs';
import { DomainEntity } from '@shared/common/common.domain';

import type {
  AppConfigData,
  AppConfigKey,
  AppConfigurationPg,
  AppConfigurationPlain,
  AppConfigurationUpdateData,
} from './app-configuration.type';

export class AppConfiguration<
  K extends AppConfigKey,
> extends DomainEntity<AppConfigurationPg> {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly configKey: K;
  readonly configData: AppConfigData[K];

  constructor(plain: AppConfigurationPlain<K>) {
    super();
    Object.assign(this, plain);
  }

  edit(data: AppConfigurationUpdateData<K>) {
    const plain: AppConfigurationPlain<AppConfigKey> = {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: myDayjs().toDate(),
      configKey: this.configKey,
      configData: data.configData,
    };

    Object.assign(this, plain);
  }
}
