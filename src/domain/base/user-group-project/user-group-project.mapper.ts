import type {
  UserGroupProjectJson,
  UserGroupProjectPg,
  UserGroupProjectPlain,
} from './types/user-group-project.domain.type';
import { UserGroupProject } from './user-group-project.domain';

export class UserGroupProjectMapper {
  static fromPg(pg: UserGroupProjectPg): UserGroupProject {
    const plain: UserGroupProjectPlain = {
      id: pg.id,
      projectId: pg.project_id,
      userGroupId: pg.user_group_id,
    };

    return new UserGroupProject(plain);
  }

  static fromPgWithState(pg: UserGroupProjectPg): UserGroupProject {
    return this.fromPg(pg).setPgState(this.toPg);
  }

  static fromPlain(plainData: UserGroupProjectPlain): UserGroupProject {
    const plain: UserGroupProjectPlain = {
      id: plainData.id,
      projectId: plainData.projectId,
      userGroupId: plainData.userGroupId,
    };

    return new UserGroupProject(plain);
  }

  static fromJson(json: UserGroupProjectJson): UserGroupProject {
    const plain: UserGroupProjectPlain = {
      id: json.id,
      projectId: json.projectId,
      userGroupId: json.userGroupId,
    };

    return new UserGroupProject(plain);
  }

  static toPg(userGroupProject: UserGroupProjectPlain): UserGroupProjectPg {
    return {
      id: userGroupProject.id,
      project_id: userGroupProject.projectId,
      user_group_id: userGroupProject.userGroupId,
    };
  }

  static toPlain(userGroupProject: UserGroupProject): UserGroupProjectPlain {
    return {
      id: userGroupProject.id,
      projectId: userGroupProject.projectId,
      userGroupId: userGroupProject.userGroupId,
    };
  }

  static toJson(userGroupProject: UserGroupProject): UserGroupProjectJson {
    return {
      id: userGroupProject.id,
      projectId: userGroupProject.projectId,
      userGroupId: userGroupProject.userGroupId,
    };
  }
}
