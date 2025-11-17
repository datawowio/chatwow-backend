import { CommentModule } from './base/comment/comment.module';
import { PostModule } from './base/post/post.module';
import { UserModule } from './base/user/user.module';
import { QueueModule } from './orchestration/queue/queue.module';

export const DOMAIN_PROVIDER = [
  //
  UserModule,
  PostModule,
  CommentModule,

  //
  QueueModule,
];
