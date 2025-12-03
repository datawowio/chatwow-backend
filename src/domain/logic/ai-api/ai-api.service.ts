import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@infra/config';

import { SendAiApiOpts } from './ai-api.type';

@Injectable()
export class AiApiService {
  url: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    const aiConfig = this.configService.getOrThrow<AppConfig['ai']>('ai');
    this.url = aiConfig.url;
  }

  async chat(_opts: SendAiApiOpts) {
    //
  }
}
