import { LineBaseJobData } from '../line-event.type';

export type LineSendMessageJobData = LineBaseJobData<{
  replyToken: string;
  text: string;
}>;
