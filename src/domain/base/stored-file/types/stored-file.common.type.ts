export type StoredFileSortKey = 'id';

export type StoredFileQueryOptions = {
  filter?: {
    refName?: string;
    ownerTable?: string;
    ownerId?: string;
  };
};

export type GetPresignUploadUrlOpts = {
  ownerTable: string;
  ownerId: string;
};
