import { AuditLogModule } from './base/audit-log/audit-log.module';
import { LineAccountModule } from './base/line-account/line-account.module';
import { LineBotModule } from './base/line-bot/line-bot.module';
import { LineChatLogModule } from './base/line-chat-log/line-chat-log.module';
import { LineSessionModule } from './base/line-session/line-session.module';
import { MessageTaskModule } from './base/message-task/message-task.module';
import { PasswordResetTokenModule } from './base/password-reset-token/password-reset-token.module';
import { ProjectChatModule } from './base/project-chat/project-chat.module';
import { ProjectDocumentModule } from './base/project-document/project-document.module';
import { ProjectModule } from './base/project/project.module';
import { SessionModule } from './base/session/session.module';
import { StoredFileModule } from './base/stored-file/stored-file.module';
import { UserGroupProjectModule } from './base/user-group-project/user-group-project.module';
import { UserGroupUserModule } from './base/user-group-user/user-group-user.module';
import { UserGroupModule } from './base/user-group/user-group.module';
import { UserManageProjectModule } from './base/user-manage-project/user-manage-project.module';
import { UserVerificationModule } from './base/user-verification/user-verification.module';
import { UserModule } from './base/user/user.module';
import { AiApiModule } from './logic/ai-api/api-api.module';
import { PgModule } from './logic/pg/pg.module';
import { QueueModule } from './queue/queue.module';

export const DOMAIN_PROVIDER = [
  //
  AuditLogModule,
  LineAccountModule,
  LineChatLogModule,
  LineSessionModule,
  ProjectModule,
  ProjectDocumentModule,
  StoredFileModule,
  UserModule,
  UserGroupModule,
  UserGroupProjectModule,
  UserGroupUserModule,
  UserManageProjectModule,
  UserVerificationModule,
  ProjectChatModule,
  SessionModule,
  PasswordResetTokenModule,
  LineBotModule,
  MessageTaskModule,

  QueueModule,
  PgModule,
  AiApiModule,
];
