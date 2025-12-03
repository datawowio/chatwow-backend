import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import rx from 'rxjs';

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
    const url = this.url;
    const data = {};
    const headers = {};

    const obs = this.httpService.post(url, data, { headers }).pipe(
      rx.retry({
        count: 3,
        delay: (error: AxiosError, retryCount: number) => {
          console.log(`Retry attempt #${retryCount}`, error.message);
          return rx.timer(1000);
        },
      }),
      rx.catchError((e: AxiosError) =>
        rx.of({
          isSuccess: false,
          data: e.response?.data ?? null,
          err: e,
        }),
      ),
    );

    const _res = await rx.firstValueFrom(obs);
    //
  }
}
