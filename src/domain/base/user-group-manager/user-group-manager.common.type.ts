export type UserGroupManagerSortKey = 'id';

export type UserGroupManagerQueryOptions = {
  filter?: {
    userId?: string;
    userGroupId?: string;
  };
};
