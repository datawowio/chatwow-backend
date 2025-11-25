import { Injectable } from '@nestjs/common';

import { LineProcessSelectionMenuJobData } from './line-process-selection-menu.type';

@Injectable()
export class LineProcessSelectionMenuCommand {
  async exec(_body: LineProcessSelectionMenuJobData) {
    // verify logic
  }
}
