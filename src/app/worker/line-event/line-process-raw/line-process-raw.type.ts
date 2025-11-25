import { LineWebHookMessage } from '@infra/global/line/line.type';

import { LineBaseJobData } from '../line-event.type';

export type LineProcessRawJobData = LineBaseJobData<LineWebHookMessage>;
