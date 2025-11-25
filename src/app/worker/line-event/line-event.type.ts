export type LineBaseJobData<T> = {
  config: {
    channelAccessToken: string;
    channelSecret: string;
  };
  data: T;
};
