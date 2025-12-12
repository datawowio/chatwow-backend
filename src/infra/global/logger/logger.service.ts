import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from '@infra/config';

import { prettyLogError } from '@shared/common/common.logger';

import type { ReqData } from '../req-storage/req-storage.common';
import { TraceLog } from './logger.type';

@Injectable()
export class LoggerService {
  private _enableJsonLog: boolean;

  private readonly _traceLogger = new Logger('trace');
  private readonly _exceptionLogger = new Logger('exception');

  constructor(private configService: ConfigService) {
    const appConfig = this.configService.getOrThrow<AppConfig['app']>('app');
    this._enableJsonLog = appConfig?.enableJsonLog;
  }

  trace(ctx: ReqData, message: string, data?: any) {
    const traceLog: TraceLog = {
      message,
      traceId: ctx.traceId,
      requestTime: ctx.requestTime,
      data,
    };

    this._traceLogger.log(traceLog);
  }

  error(exception: Error | unknown) {
    if (!this._enableJsonLog) {
      prettyLogError(exception as Error);
    }
  }
}
