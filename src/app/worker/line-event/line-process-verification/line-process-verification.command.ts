import { Injectable } from '@nestjs/common';

import { LineProcessVerificationJobData } from './line-process-verification.type';

@Injectable()
export class LineProcessVerificationCommand {
  async exec(_body: LineProcessVerificationJobData) {
    // verify logic
  }
}
