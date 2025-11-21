import { Injectable } from '@nestjs/common';

import { User } from './user.domain';
import { UserMapper } from './user.mapper';
import { UserRepo } from './user.repo';
import { UserCountQueryOptions, UserQueryOptions } from './user.zod';

@Injectable()
export class UserService {
  constructor(private repo: UserRepo) {}

  async getIds(query?: UserQueryOptions) {
    return this.repo.getIds(query);
  }

  async getCount(query?: UserCountQueryOptions) {
    return this.repo.getCount(query);
  }

  async findOne(id: string) {
    return this.repo.findOne(id);
  }

  async save(user: User) {
    this._validate(user);

    if (!user.isPersist) {
      await this.repo.create(user);
    } else {
      await this.repo.update(user.id, user);
    }

    user.setPgState(UserMapper.toPg);
  }

  async saveBulk(users: User[]) {
    return Promise.all(users.map((u) => this.save(u)));
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  private _validate(_user: User) {
    // validation rules can be added here
  }
}
