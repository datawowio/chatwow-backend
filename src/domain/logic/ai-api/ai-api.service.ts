import { AiModelName } from '@domain/base/ai-model/ai-model.type';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import * as rx from 'rxjs';

import { AppConfig } from '@infra/config';

import { isLocal } from '@shared/common/common.func';

import {
  AiChat,
  AiRawResponse,
  AiRequest,
  AiResponse,
  SendAiApiOpts,
} from './ai-api.type';

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

  async chat(opts: SendAiApiOpts): Promise<AiChat> {
    const appConfig = this.configService.getOrThrow<AppConfig['app']>('app');

    if (isLocal(appConfig.nodeEnv)) {
      return {
        isSuccess: true,
        data: {
          text: 'ตอบสำเร็จ',
          confidence: 100,
          tokenUsage: [
            {
              inputTokens: 200,
              outputTokens: 120,
              totalTokens: 520,
              cacheCreationInputTokens: 100,
              cacheReadInputTokens: 100,
              modelName: 'gpt-4.1',
            },
          ],
        },
      };
    }

    const url = `${this.url}/chat`;
    const data: AiRequest = {
      text: opts.text,
      project_id: opts.project.id,
      session_id: opts.sessionId,
    };

    const headers = {};

    const obs = this.httpService
      .post<AiRawResponse>(url, data, { headers })
      .pipe(
        rx.retry({
          count: 3,
          delay: (error: AxiosError, retryCount: number) => {
            console.log(`Retry attempt #${retryCount}`, error.message);
            return rx.timer(1000);
          },
        }),
        rx.map((d): { isSuccess: true; data: AiResponse } => ({
          isSuccess: true,
          data: {
            text: d.data.text,
            // TODO: implement real after ds done
            confidence: 100,
            tokenUsage:
              d.data.token_usage?.map((tu) => ({
                inputTokens: tu.input_tokens,
                outputTokens: tu.output_tokens,
                totalTokens: tu.total_tokens,
                cacheCreationInputTokens: tu.cache_creation_input_tokens,
                cacheReadInputTokens: tu.cache_read_input_tokens,
                modelName: tu.model_name as AiModelName,
              })) ?? [],
          },
        })),
        rx.catchError((e: AxiosError) =>
          rx.of<{ isSuccess: false; data: unknown; err: AxiosError }>({
            isSuccess: false,
            data: e.response?.data ?? null,
            err: e,
          }),
        ),
      );

    return rx.firstValueFrom(obs);
  }
}
