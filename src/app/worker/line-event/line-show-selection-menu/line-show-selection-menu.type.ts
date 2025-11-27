import { LineMessageMetaData, LineMessageMetaInput } from '../line-event.type';

type Data = {
  replyToken: string;
  lineAccountId: string;
  addMessages?: string[];
};
export type LineShowSelectionMenuJobData = LineMessageMetaData<Data>;
export type LineShowSelectionMenuJobInput = LineMessageMetaInput<Data>;
